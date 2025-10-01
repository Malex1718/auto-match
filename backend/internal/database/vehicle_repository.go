package database

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/vehiculos/backend/internal/models"
)

type VehicleRepository struct {
	db *DB
}

func NewVehicleRepository(db *DB) *VehicleRepository {
	return &VehicleRepository{db: db}
}

// GetAllVehicles obtiene todos los vehículos con paginación
func (r *VehicleRepository) GetAllVehicles(ctx context.Context, page, limit int) ([]models.Vehicle, int, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit

	// Contar total de vehículos
	var total int
	countQuery := `SELECT COUNT(*) FROM vehicles`
	err := r.db.SQL.QueryRowContext(ctx, countQuery).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Obtener vehículos con información relacionada
	query := `
		SELECT 
			v.id, v.brand_id, v.model, v.year, v.type_id, 
			v.price, v.currency, v.fuel_type_id, v.transmission_id,
			v.doors, v.seats, v.engine_size, v.horsepower, v.torque,
			v.fuel_economy, v.tank_capacity, v.cargo_space,
			v.image_url, v.description, v.safety_rating,
			v.created_at, v.updated_at,
			b.name, b.logo, b.country,
			vt.name, ft.name, t.name
		FROM vehicles v
		JOIN brands b ON v.brand_id = b.id
		JOIN vehicle_types vt ON v.type_id = vt.id
		JOIN fuel_types ft ON v.fuel_type_id = ft.id
		JOIN transmissions t ON v.transmission_id = t.id
		ORDER BY v.created_at DESC
		LIMIT $1 OFFSET $2
	`

	rows, err := r.db.SQL.QueryContext(ctx, query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var vehicles []models.Vehicle
	for rows.Next() {
		var v models.Vehicle
		var brand models.Brand
		var vType models.VehicleType
		var fuelType models.FuelType
		var transmission models.Transmission

		err := rows.Scan(
			&v.ID, &v.BrandID, &v.Model, &v.Year, &v.TypeID,
			&v.Price, &v.Currency, &v.FuelTypeID, &v.TransmissionID,
			&v.Doors, &v.Seats, &v.EngineSize, &v.Horsepower, &v.Torque,
			&v.FuelEconomy, &v.TankCapacity, &v.CargoSpace,
			&v.ImageURL, &v.Description, &v.SafetyRating,
			&v.CreatedAt, &v.UpdatedAt,
			&brand.Name, &brand.Logo, &brand.Country,
			&vType.Name, &fuelType.Name, &transmission.Name,
		)
		if err != nil {
			return nil, 0, err
		}

		v.Brand = &brand
		v.Type = &vType
		v.FuelType = &fuelType
		v.Transmission = &transmission

		// Obtener características
		features, err := r.getVehicleFeatures(ctx, v.ID)
		if err == nil {
			v.Features = features
		}

		vehicles = append(vehicles, v)
	}

	return vehicles, total, nil
}

// GetVehicleByID obtiene un vehículo por su ID
func (r *VehicleRepository) GetVehicleByID(ctx context.Context, id int) (*models.Vehicle, error) {
	// Intentar obtener del caché
	cacheKey := fmt.Sprintf("vehicle:%d", id)
	if cached, err := r.db.GetCache(cacheKey); err == nil {
		var vehicle models.Vehicle
		if err := json.Unmarshal([]byte(cached), &vehicle); err == nil {
			return &vehicle, nil
		}
	}

	query := `
		SELECT 
			v.id, v.brand_id, v.model, v.year, v.type_id, 
			v.price, v.currency, v.fuel_type_id, v.transmission_id,
			v.doors, v.seats, v.engine_size, v.horsepower, v.torque,
			v.fuel_economy, v.tank_capacity, v.cargo_space,
			v.image_url, v.description, v.safety_rating,
			v.created_at, v.updated_at,
			b.id, b.name, b.logo, b.country,
			vt.id, vt.name, 
			ft.id, ft.name, 
			t.id, t.name
		FROM vehicles v
		JOIN brands b ON v.brand_id = b.id
		JOIN vehicle_types vt ON v.type_id = vt.id
		JOIN fuel_types ft ON v.fuel_type_id = ft.id
		JOIN transmissions t ON v.transmission_id = t.id
		WHERE v.id = $1
	`

	var v models.Vehicle
	var brand models.Brand
	var vType models.VehicleType
	var fuelType models.FuelType
	var transmission models.Transmission

	err := r.db.SQL.QueryRowContext(ctx, query, id).Scan(
		&v.ID, &v.BrandID, &v.Model, &v.Year, &v.TypeID,
		&v.Price, &v.Currency, &v.FuelTypeID, &v.TransmissionID,
		&v.Doors, &v.Seats, &v.EngineSize, &v.Horsepower, &v.Torque,
		&v.FuelEconomy, &v.TankCapacity, &v.CargoSpace,
		&v.ImageURL, &v.Description, &v.SafetyRating,
		&v.CreatedAt, &v.UpdatedAt,
		&brand.ID, &brand.Name, &brand.Logo, &brand.Country,
		&vType.ID, &vType.Name,
		&fuelType.ID, &fuelType.Name,
		&transmission.ID, &transmission.Name,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("vehículo no encontrado")
		}
		return nil, err
	}

	v.Brand = &brand
	v.Type = &vType
	v.FuelType = &fuelType
	v.Transmission = &transmission

	// Obtener características
	features, err := r.getVehicleFeatures(ctx, v.ID)
	if err == nil {
		v.Features = features
	}

	// Guardar en caché
	if data, err := json.Marshal(v); err == nil {
		r.db.SetCache(cacheKey, string(data), 5*time.Minute)
	}

	return &v, nil
}

// SearchVehicles busca vehículos con filtros
func (r *VehicleRepository) SearchVehicles(ctx context.Context, filter models.SearchFilter) ([]models.Vehicle, int, error) {
	var conditions []string
	var args []interface{}
	argCounter := 1

	// Construir condiciones WHERE dinámicamente
	if len(filter.BrandID) > 0 {
		placeholders := make([]string, len(filter.BrandID))
		for i, id := range filter.BrandID {
			placeholders[i] = fmt.Sprintf("$%d", argCounter)
			args = append(args, id)
			argCounter++
		}
		conditions = append(conditions, fmt.Sprintf("v.brand_id IN (%s)", strings.Join(placeholders, ",")))
	}

	if len(filter.TypeID) > 0 {
		placeholders := make([]string, len(filter.TypeID))
		for i, id := range filter.TypeID {
			placeholders[i] = fmt.Sprintf("$%d", argCounter)
			args = append(args, id)
			argCounter++
		}
		conditions = append(conditions, fmt.Sprintf("v.type_id IN (%s)", strings.Join(placeholders, ",")))
	}

	if len(filter.FuelTypeID) > 0 {
		placeholders := make([]string, len(filter.FuelTypeID))
		for i, id := range filter.FuelTypeID {
			placeholders[i] = fmt.Sprintf("$%d", argCounter)
			args = append(args, id)
			argCounter++
		}
		conditions = append(conditions, fmt.Sprintf("v.fuel_type_id IN (%s)", strings.Join(placeholders, ",")))
	}

	if len(filter.TransmissionID) > 0 {
		placeholders := make([]string, len(filter.TransmissionID))
		for i, id := range filter.TransmissionID {
			placeholders[i] = fmt.Sprintf("$%d", argCounter)
			args = append(args, id)
			argCounter++
		}
		conditions = append(conditions, fmt.Sprintf("v.transmission_id IN (%s)", strings.Join(placeholders, ",")))
	}

	if filter.PriceMin > 0 {
		conditions = append(conditions, fmt.Sprintf("v.price >= $%d", argCounter))
		args = append(args, filter.PriceMin)
		argCounter++
	}

	if filter.PriceMax > 0 {
		conditions = append(conditions, fmt.Sprintf("v.price <= $%d", argCounter))
		args = append(args, filter.PriceMax)
		argCounter++
	}

	if filter.YearMin > 0 {
		conditions = append(conditions, fmt.Sprintf("v.year >= $%d", argCounter))
		args = append(args, filter.YearMin)
		argCounter++
	}

	if filter.YearMax > 0 {
		conditions = append(conditions, fmt.Sprintf("v.year <= $%d", argCounter))
		args = append(args, filter.YearMax)
		argCounter++
	}

	if filter.DoorsMin > 0 {
		conditions = append(conditions, fmt.Sprintf("v.doors >= $%d", argCounter))
		args = append(args, filter.DoorsMin)
		argCounter++
	}

	if filter.SeatsMin > 0 {
		conditions = append(conditions, fmt.Sprintf("v.seats >= $%d", argCounter))
		args = append(args, filter.SeatsMin)
		argCounter++
	}

	if filter.FuelEconomyMin > 0 {
		conditions = append(conditions, fmt.Sprintf("v.fuel_economy >= $%d", argCounter))
		args = append(args, filter.FuelEconomyMin)
		argCounter++
	}

	// Búsqueda de texto
	if filter.Query != "" {
		conditions = append(conditions, fmt.Sprintf(
			"to_tsvector('spanish', v.model || ' ' || COALESCE(v.description, '')) @@ plainto_tsquery('spanish', $%d)",
			argCounter,
		))
		args = append(args, filter.Query)
		argCounter++
	}

	// Construir query WHERE
	whereClause := ""
	if len(conditions) > 0 {
		whereClause = "WHERE " + strings.Join(conditions, " AND ")
	}

	// Contar total con filtros
	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM vehicles v %s`, whereClause)
	var total int
	err := r.db.SQL.QueryRowContext(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Ordenamiento
	orderBy := "v.created_at DESC"
	switch filter.SortBy {
	case "price_asc":
		orderBy = "v.price ASC"
	case "price_desc":
		orderBy = "v.price DESC"
	case "year_desc":
		orderBy = "v.year DESC"
	case "fuel_economy_desc":
		orderBy = "v.fuel_economy DESC"
	}

	// Paginación
	if filter.Page < 1 {
		filter.Page = 1
	}
	if filter.Limit < 1 || filter.Limit > 100 {
		filter.Limit = 20
	}
	offset := (filter.Page - 1) * filter.Limit

	// Query principal
	query := fmt.Sprintf(`
		SELECT 
			v.id, v.brand_id, v.model, v.year, v.type_id, 
			v.price, v.currency, v.fuel_type_id, v.transmission_id,
			v.doors, v.seats, v.engine_size, v.horsepower, v.torque,
			v.fuel_economy, v.tank_capacity, v.cargo_space,
			v.image_url, v.description, v.safety_rating,
			v.created_at, v.updated_at,
			b.name, b.logo, b.country,
			vt.name, ft.name, t.name
		FROM vehicles v
		JOIN brands b ON v.brand_id = b.id
		JOIN vehicle_types vt ON v.type_id = vt.id
		JOIN fuel_types ft ON v.fuel_type_id = ft.id
		JOIN transmissions t ON v.transmission_id = t.id
		%s
		ORDER BY %s
		LIMIT $%d OFFSET $%d
	`, whereClause, orderBy, argCounter, argCounter+1)

	args = append(args, filter.Limit, offset)

	rows, err := r.db.SQL.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var vehicles []models.Vehicle
	for rows.Next() {
		var v models.Vehicle
		var brand models.Brand
		var vType models.VehicleType
		var fuelType models.FuelType
		var transmission models.Transmission

		err := rows.Scan(
			&v.ID, &v.BrandID, &v.Model, &v.Year, &v.TypeID,
			&v.Price, &v.Currency, &v.FuelTypeID, &v.TransmissionID,
			&v.Doors, &v.Seats, &v.EngineSize, &v.Horsepower, &v.Torque,
			&v.FuelEconomy, &v.TankCapacity, &v.CargoSpace,
			&v.ImageURL, &v.Description, &v.SafetyRating,
			&v.CreatedAt, &v.UpdatedAt,
			&brand.Name, &brand.Logo, &brand.Country,
			&vType.Name, &fuelType.Name, &transmission.Name,
		)
		if err != nil {
			return nil, 0, err
		}

		v.Brand = &brand
		v.Type = &vType
		v.FuelType = &fuelType
		v.Transmission = &transmission

		vehicles = append(vehicles, v)
	}

	return vehicles, total, nil
}

// Métodos auxiliares
func (r *VehicleRepository) getVehicleFeatures(ctx context.Context, vehicleID int) ([]string, error) {
	query := `SELECT feature FROM vehicle_features WHERE vehicle_id = $1`
	rows, err := r.db.SQL.QueryContext(ctx, query, vehicleID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var features []string
	for rows.Next() {
		var feature string
		if err := rows.Scan(&feature); err != nil {
			return nil, err
		}
		features = append(features, feature)
	}

	return features, nil
}

// GetBrands obtiene todas las marcas
func (r *VehicleRepository) GetBrands(ctx context.Context) ([]models.Brand, error) {
	query := `SELECT id, name, logo, country FROM brands ORDER BY name`
	rows, err := r.db.SQL.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var brands []models.Brand
	for rows.Next() {
		var b models.Brand
		err := rows.Scan(&b.ID, &b.Name, &b.Logo, &b.Country)
		if err != nil {
			return nil, err
		}
		brands = append(brands, b)
	}

	return brands, nil
}

// GetVehicleTypes obtiene todos los tipos de vehículo
func (r *VehicleRepository) GetVehicleTypes(ctx context.Context) ([]models.VehicleType, error) {
	query := `SELECT id, name FROM vehicle_types ORDER BY name`
	rows, err := r.db.SQL.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var types []models.VehicleType
	for rows.Next() {
		var t models.VehicleType
		err := rows.Scan(&t.ID, &t.Name)
		if err != nil {
			return nil, err
		}
		types = append(types, t)
	}

	return types, nil
}

// GetFuelTypes obtiene todos los tipos de combustible
func (r *VehicleRepository) GetFuelTypes(ctx context.Context) ([]models.FuelType, error) {
	query := `SELECT id, name FROM fuel_types ORDER BY name`
	rows, err := r.db.SQL.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var types []models.FuelType
	for rows.Next() {
		var t models.FuelType
		err := rows.Scan(&t.ID, &t.Name)
		if err != nil {
			return nil, err
		}
		types = append(types, t)
	}

	return types, nil
}

// GetTransmissions obtiene todos los tipos de transmisión
func (r *VehicleRepository) GetTransmissions(ctx context.Context) ([]models.Transmission, error) {
	query := `SELECT id, name FROM transmissions ORDER BY name`
	rows, err := r.db.SQL.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var transmissions []models.Transmission
	for rows.Next() {
		var t models.Transmission
		err := rows.Scan(&t.ID, &t.Name)
		if err != nil {
			return nil, err
		}
		transmissions = append(transmissions, t)
	}

	return transmissions, nil
}