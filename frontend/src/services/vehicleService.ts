import axios from 'axios'
import { Vehicle, VehicleResponse, SearchFilter } from '../types/vehicle'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Get all vehicles with pagination
export const getVehicles = async (page = 1, limit = 12): Promise<VehicleResponse> => {
  try {
    const response = await api.get('/vehicles', {
      params: { page, limit }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    throw error
  }
}

// Get vehicle by ID
export const getVehicleById = async (id: number): Promise<Vehicle> => {
  try {
    const response = await api.get(`/vehicles/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    throw error
  }
}

// Search vehicles with filters
export const searchVehicles = async (filters: SearchFilter): Promise<VehicleResponse> => {
  try {
    const params = new URLSearchParams()
    
    if (filters.query) params.append('q', filters.query)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())
    if (filters.sortBy) params.append('sort_by', filters.sortBy)
    
    if (filters.priceMin && filters.priceMin > 0) params.append('price_min', filters.priceMin.toString())
    if (filters.priceMax && filters.priceMax > 0) params.append('price_max', filters.priceMax.toString())
    if (filters.yearMin && filters.yearMin > 0) params.append('year_min', filters.yearMin.toString())
    if (filters.yearMax && filters.yearMax > 0) params.append('year_max', filters.yearMax.toString())
    if (filters.doorsMin && filters.doorsMin > 0) params.append('doors_min', filters.doorsMin.toString())
    if (filters.seatsMin && filters.seatsMin > 0) params.append('seats_min', filters.seatsMin.toString())
    if (filters.fuelEconomyMin && filters.fuelEconomyMin > 0) params.append('fuel_economy_min', filters.fuelEconomyMin.toString())
    
    // Add array parameters
    filters.brandIds?.forEach(id => params.append('brand_id', id.toString()))
    filters.typeIds?.forEach(id => params.append('type_id', id.toString()))
    filters.fuelTypeIds?.forEach(id => params.append('fuel_type_id', id.toString()))
    filters.transmissionIds?.forEach(id => params.append('transmission_id', id.toString()))
    
    const response = await api.get(`/vehicles/search?${params.toString()}`)
    return response.data
  } catch (error) {
    console.error('Error searching vehicles:', error)
    throw error
  }
}

// Get filter options (brands, types, etc.)
export const getFilters = async () => {
  try {
    const response = await api.get('/filters')
    return response.data
  } catch (error) {
    console.error('Error fetching filters:', error)
    throw error
  }
}

// Get brands
export const getBrands = async () => {
  try {
    const response = await api.get('/brands')
    return response.data
  } catch (error) {
    console.error('Error fetching brands:', error)
    throw error
  }
}

// Get vehicle types
export const getVehicleTypes = async () => {
  try {
    const response = await api.get('/vehicle-types')
    return response.data
  } catch (error) {
    console.error('Error fetching vehicle types:', error)
    throw error
  }
}

// Get fuel types
export const getFuelTypes = async () => {
  try {
    const response = await api.get('/fuel-types')
    return response.data
  } catch (error) {
    console.error('Error fetching fuel types:', error)
    throw error
  }
}

// Get transmissions
export const getTransmissions = async () => {
  try {
    const response = await api.get('/transmissions')
    return response.data
  } catch (error) {
    console.error('Error fetching transmissions:', error)
    throw error
  }
}

// Compare vehicles
export const compareVehicles = async (vehicleIds: number[]): Promise<Vehicle[]> => {
  try {
    const response = await api.post('/vehicles/compare', { vehicleIds })
    return response.data
  } catch (error) {
    console.error('Error comparing vehicles:', error)
    throw error
  }
}

// Save user search (for analytics and AI training)
export const saveUserSearch = async (searchData: {
  query?: string
  filters: SearchFilter
  selectedVehicleId?: number
  sessionId: string
}) => {
  try {
    await api.post('/user-searches', searchData)
  } catch (error) {
    console.error('Error saving user search:', error)
  }
}

// Save user preferences (for AI assistant)
export const saveUserPreference = async (preferenceData: {
  sessionId: string
  preferenceType: string
  preferenceValue: string
}) => {
  try {
    await api.post('/user-preferences', preferenceData)
  } catch (error) {
    console.error('Error saving user preference:', error)
  }
}