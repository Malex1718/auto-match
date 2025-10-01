export interface Brand {
  id: number
  name: string
  logo?: string
  country?: string
}

export interface VehicleType {
  id: number
  name: string
}

export interface FuelType {
  id: number
  name: string
}

export interface Transmission {
  id: number
  name: string
}

export interface Vehicle {
  id: number
  brandId: number
  brand?: Brand
  model: string
  year: number
  typeId: number
  type?: VehicleType
  price: number
  currency: string
  fuelTypeId: number
  fuelType?: FuelType
  transmissionId: number
  transmission?: Transmission
  doors: number
  seats: number
  engineSize: number
  horsepower: number
  torque: number
  fuelEconomy: number
  tankCapacity: number
  cargoSpace: number
  imageUrl?: string
  description?: string
  features?: string[]
  safetyRating?: number
  createdAt?: string
  updatedAt?: string
}

export interface SearchFilter {
  query?: string
  brandIds?: number[]
  typeIds?: number[]
  fuelTypeIds?: number[]
  transmissionIds?: number[]
  priceMin?: number
  priceMax?: number
  yearMin?: number
  yearMax?: number
  doorsMin?: number
  seatsMin?: number
  fuelEconomyMin?: number
  sortBy?: string
  page?: number
  limit?: number
}

export interface VehicleResponse {
  vehicles: Vehicle[]
  total: number
  page: number
  limit: number
  filters?: SearchFilter
}