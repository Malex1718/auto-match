package models

import (
	"time"
)

type Brand struct {
	ID        int       `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	Logo      string    `json:"logo" db:"logo"`
	Country   string    `json:"country" db:"country"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

type VehicleType struct {
	ID   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"` // SUV, Sedan, Pickup, Hatchback, etc.
}

type FuelType struct {
	ID   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"` // Gasolina, Diesel, Híbrido, Eléctrico
}

type Transmission struct {
	ID   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"` // Manual, Automática, CVT, Dual-Clutch
}

type Vehicle struct {
	ID             int       `json:"id" db:"id"`
	BrandID        int       `json:"brand_id" db:"brand_id"`
	Brand          *Brand    `json:"brand,omitempty"`
	Model          string    `json:"model" db:"model"`
	Year           int       `json:"year" db:"year"`
	TypeID         int       `json:"type_id" db:"type_id"`
	Type           *VehicleType `json:"type,omitempty"`
	Price          float64   `json:"price" db:"price"`
	Currency       string    `json:"currency" db:"currency"` // MXN, USD
	FuelTypeID     int       `json:"fuel_type_id" db:"fuel_type_id"`
	FuelType       *FuelType `json:"fuel_type,omitempty"`
	TransmissionID int       `json:"transmission_id" db:"transmission_id"`
	Transmission   *Transmission `json:"transmission,omitempty"`
	Doors          int       `json:"doors" db:"doors"`
	Seats          int       `json:"seats" db:"seats"`
	EngineSize     float64   `json:"engine_size" db:"engine_size"` // Litros
	Horsepower     int       `json:"horsepower" db:"horsepower"`
	Torque         int       `json:"torque" db:"torque"` // Nm
	FuelEconomy    float64   `json:"fuel_economy" db:"fuel_economy"` // km/l
	TankCapacity   float64   `json:"tank_capacity" db:"tank_capacity"` // Litros
	CargoSpace     float64   `json:"cargo_space" db:"cargo_space"` // Litros
	ImageURL       string    `json:"image_url" db:"image_url"`
	Description    string    `json:"description" db:"description"`
	Features       []string  `json:"features"` // Array de características
	SafetyRating   float64   `json:"safety_rating" db:"safety_rating"` // 0-5
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time `json:"updated_at" db:"updated_at"`
}

type VehicleFeature struct {
	ID        int    `json:"id" db:"id"`
	VehicleID int    `json:"vehicle_id" db:"vehicle_id"`
	Feature   string `json:"feature" db:"feature"`
}

type SearchFilter struct {
	BrandID        []int     `json:"brand_ids"`
	TypeID         []int     `json:"type_ids"`
	FuelTypeID     []int     `json:"fuel_type_ids"`
	TransmissionID []int     `json:"transmission_ids"`
	PriceMin       float64   `json:"price_min"`
	PriceMax       float64   `json:"price_max"`
	YearMin        int       `json:"year_min"`
	YearMax        int       `json:"year_max"`
	DoorsMin       int       `json:"doors_min"`
	SeatsMin       int       `json:"seats_min"`
	FuelEconomyMin float64   `json:"fuel_economy_min"`
	Query          string    `json:"query"` // Búsqueda de texto
	SortBy         string    `json:"sort_by"` // price_asc, price_desc, year_desc, fuel_economy_desc
	Page           int       `json:"page"`
	Limit          int       `json:"limit"`
}