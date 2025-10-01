package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/vehiculos/backend/internal/database"
	"github.com/vehiculos/backend/internal/models"
)

type VehicleHandler struct {
	repo *database.VehicleRepository
}

func NewVehicleHandler(repo *database.VehicleRepository) *VehicleHandler {
	return &VehicleHandler{repo: repo}
}

// GetVehicles obtiene todos los vehículos con paginación
func (h *VehicleHandler) GetVehicles(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	vehicles, total, err := h.repo.GetAllVehicles(c.Request.Context(), page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error al obtener vehículos",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"vehicles": vehicles,
		"total":    total,
		"page":     page,
		"limit":    limit,
	})
}

// GetVehicleByID obtiene un vehículo por su ID
func (h *VehicleHandler) GetVehicleByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "ID inválido",
		})
		return
	}

	vehicle, err := h.repo.GetVehicleByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Vehículo no encontrado",
		})
		return
	}

	c.JSON(http.StatusOK, vehicle)
}

// SearchVehicles busca vehículos con filtros
func (h *VehicleHandler) SearchVehicles(c *gin.Context) {
	var filter models.SearchFilter
	
	// Obtener parámetros de query
	filter.Page, _ = strconv.Atoi(c.DefaultQuery("page", "1"))
	filter.Limit, _ = strconv.Atoi(c.DefaultQuery("limit", "20"))
	filter.Query = c.Query("q")
	filter.SortBy = c.Query("sort_by")
	
	// Parsear filtros de precio
	if priceMin := c.Query("price_min"); priceMin != "" {
		filter.PriceMin, _ = strconv.ParseFloat(priceMin, 64)
	}
	if priceMax := c.Query("price_max"); priceMax != "" {
		filter.PriceMax, _ = strconv.ParseFloat(priceMax, 64)
	}
	
	// Parsear filtros de año
	if yearMin := c.Query("year_min"); yearMin != "" {
		filter.YearMin, _ = strconv.Atoi(yearMin)
	}
	if yearMax := c.Query("year_max"); yearMax != "" {
		filter.YearMax, _ = strconv.Atoi(yearMax)
	}
	
	// Parsear otros filtros numéricos
	if doorsMin := c.Query("doors_min"); doorsMin != "" {
		filter.DoorsMin, _ = strconv.Atoi(doorsMin)
	}
	if seatsMin := c.Query("seats_min"); seatsMin != "" {
		filter.SeatsMin, _ = strconv.Atoi(seatsMin)
	}
	if fuelEconomyMin := c.Query("fuel_economy_min"); fuelEconomyMin != "" {
		filter.FuelEconomyMin, _ = strconv.ParseFloat(fuelEconomyMin, 64)
	}
	
	// Parsear arrays de IDs
	if brandIDs := c.QueryArray("brand_id"); len(brandIDs) > 0 {
		for _, id := range brandIDs {
			if intID, err := strconv.Atoi(id); err == nil {
				filter.BrandID = append(filter.BrandID, intID)
			}
		}
	}
	
	if typeIDs := c.QueryArray("type_id"); len(typeIDs) > 0 {
		for _, id := range typeIDs {
			if intID, err := strconv.Atoi(id); err == nil {
				filter.TypeID = append(filter.TypeID, intID)
			}
		}
	}
	
	if fuelTypeIDs := c.QueryArray("fuel_type_id"); len(fuelTypeIDs) > 0 {
		for _, id := range fuelTypeIDs {
			if intID, err := strconv.Atoi(id); err == nil {
				filter.FuelTypeID = append(filter.FuelTypeID, intID)
			}
		}
	}
	
	if transmissionIDs := c.QueryArray("transmission_id"); len(transmissionIDs) > 0 {
		for _, id := range transmissionIDs {
			if intID, err := strconv.Atoi(id); err == nil {
				filter.TransmissionID = append(filter.TransmissionID, intID)
			}
		}
	}

	// Si se envía el body como JSON, intentar parsearlo
	if c.Request.Method == "POST" {
		if err := c.ShouldBindJSON(&filter); err != nil {
			// No es error crítico, los filtros ya se obtuvieron del query
		}
	}

	vehicles, total, err := h.repo.SearchVehicles(c.Request.Context(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error al buscar vehículos",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"vehicles": vehicles,
		"total":    total,
		"page":     filter.Page,
		"limit":    filter.Limit,
		"filters":  filter,
	})
}

// GetBrands obtiene todas las marcas
func (h *VehicleHandler) GetBrands(c *gin.Context) {
	brands, err := h.repo.GetBrands(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error al obtener marcas",
		})
		return
	}

	c.JSON(http.StatusOK, brands)
}

// GetVehicleTypes obtiene todos los tipos de vehículo
func (h *VehicleHandler) GetVehicleTypes(c *gin.Context) {
	types, err := h.repo.GetVehicleTypes(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error al obtener tipos de vehículo",
		})
		return
	}

	c.JSON(http.StatusOK, types)
}

// GetFuelTypes obtiene todos los tipos de combustible
func (h *VehicleHandler) GetFuelTypes(c *gin.Context) {
	types, err := h.repo.GetFuelTypes(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error al obtener tipos de combustible",
		})
		return
	}

	c.JSON(http.StatusOK, types)
}

// GetTransmissions obtiene todos los tipos de transmisión
func (h *VehicleHandler) GetTransmissions(c *gin.Context) {
	transmissions, err := h.repo.GetTransmissions(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error al obtener tipos de transmisión",
		})
		return
	}

	c.JSON(http.StatusOK, transmissions)
}

// GetFilters obtiene todos los filtros disponibles (marcas, tipos, etc.)
func (h *VehicleHandler) GetFilters(c *gin.Context) {
	brands, err := h.repo.GetBrands(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error al obtener filtros",
		})
		return
	}

	types, err := h.repo.GetVehicleTypes(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error al obtener filtros",
		})
		return
	}

	fuelTypes, err := h.repo.GetFuelTypes(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error al obtener filtros",
		})
		return
	}

	transmissions, err := h.repo.GetTransmissions(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error al obtener filtros",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"brands":        brands,
		"vehicle_types": types,
		"fuel_types":    fuelTypes,
		"transmissions": transmissions,
	})
}