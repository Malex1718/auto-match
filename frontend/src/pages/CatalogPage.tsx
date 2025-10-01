import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, X, ChevronDown, Car, Fuel, Settings, Users, DollarSign, Calendar, SlidersHorizontal } from 'lucide-react'
import VehicleCard from '../components/VehicleCard'
import FilterSidebar from '../components/FilterSidebar'
import { Vehicle } from '../types/vehicle'
import { searchVehicles } from '../services/vehicleService'

export default function CatalogPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    query: '',
    brandIds: [] as number[],
    typeIds: [] as number[],
    fuelTypeIds: [] as number[],
    transmissionIds: [] as number[],
    priceMin: 0,
    priceMax: 0,
    yearMin: 0,
    yearMax: 0,
    doorsMin: 0,
    seatsMin: 0,
    fuelEconomyMin: 0,
    sortBy: 'created_desc'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadVehicles()
  }, [page, filters])

  const loadVehicles = async () => {
    setLoading(true)
    try {
      const response = await searchVehicles({
        ...filters,
        page,
        limit: 12
      })
      setVehicles(response.vehicles || [])
      setTotal(response.total || 0)
    } catch (error) {
      console.error('Error loading vehicles:', error)
      // For demo purposes, use mock data if API fails
      setVehicles(getMockVehicles())
      setTotal(24)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setFilters({ ...filters, query: searchQuery })
    setPage(1)
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      brandIds: [],
      typeIds: [],
      fuelTypeIds: [],
      transmissionIds: [],
      priceMin: 0,
      priceMax: 0,
      yearMin: 0,
      yearMax: 0,
      doorsMin: 0,
      seatsMin: 0,
      fuelEconomyMin: 0,
      sortBy: 'created_desc'
    })
    setSearchQuery('')
    setPage(1)
  }

  const totalPages = Math.ceil(total / 12)

  const sortOptions = [
    { value: 'created_desc', label: 'Más Recientes' },
    { value: 'price_asc', label: 'Menor Precio' },
    { value: 'price_desc', label: 'Mayor Precio' },
    { value: 'year_desc', label: 'Año Más Reciente' },
    { value: 'fuel_economy_desc', label: 'Mayor Eficiencia' }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-black border-b-4 border-black dark:border-white shadow-2xl relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(45deg, transparent 25%, black 25%, black 26%, transparent 26%, transparent 74%, black 74%, black 76%, transparent 76%)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="container-custom py-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-6">Catálogo de Vehículos</h1>

          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar por marca, modelo o características..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-5 py-4 pl-12 rounded-xl bg-white dark:bg-gray-900 border-4 border-black dark:border-white text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.7)] focus:outline-none transition-all"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-black rounded-xl shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] dark:shadow-[4px_4px_0px_0px_rgba(37,99,235,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(37,99,235,0.7)] hover:-translate-y-0.5 hover:-translate-x-0.5 transform transition-all"
            >
              Buscar
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-6 py-4 bg-white dark:bg-black border-4 border-black dark:border-white text-black dark:text-white font-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.7)] hover:-translate-y-0.5 hover:-translate-x-0.5 transform transition-all flex items-center gap-2"
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filtros
            </button>
          </div>

          {/* Active Filters */}
          {(filters.brandIds.length > 0 || filters.typeIds.length > 0 || filters.query) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.query && (
                <span className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-white text-white dark:text-black rounded-full font-bold text-sm shadow-lg">
                  Búsqueda: "{filters.query}"
                  <button
                    onClick={() => {
                      setFilters({ ...filters, query: '' })
                      setSearchQuery('')
                    }}
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-black"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {/* Results count and sort */}
          <div className="flex justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {total > 0 ? `${total} vehículos encontrados` : 'No se encontraron vehículos'}
            </p>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="px-4 py-2 bg-white dark:bg-gray-900 border-2 border-black dark:border-white rounded-lg text-black dark:text-white font-medium shadow-md hover:shadow-lg transition-all"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClear={clearFilters}
            />
          </aside>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black dark:bg-white bg-opacity-70 dark:bg-opacity-70 backdrop-blur-sm" onClick={() => setShowFilters(false)}></div>
              <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-black shadow-2xl overflow-y-auto border-l-4 border-black dark:border-white">
                <div className="p-4 border-b-2 border-gray-200 dark:border-gray-800 flex justify-between items-center">
                  <h2 className="text-lg font-black text-black dark:text-white">Filtros</h2>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="h-5 w-5 text-black dark:text-white" />
                  </button>
                </div>
                <div className="p-4">
                  <FilterSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClear={clearFilters}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl h-96 animate-pulse border-4 border-gray-200 dark:border-gray-800">
                    <div className="h-48 bg-gray-200 dark:bg-gray-800"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : vehicles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <nav className="flex gap-2">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-6 py-3 rounded-xl border-4 border-black dark:border-white text-black dark:text-white font-black hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.7)] hover:-translate-y-0.5 hover:-translate-x-0.5 transform"
                      >
                        Anterior
                      </button>
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const pageNum = i + 1
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`px-4 py-3 rounded-xl border-4 font-black transition-all transform ${
                              page === pageNum
                                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] dark:shadow-[6px_6px_0px_0px_rgba(37,99,235,0.5)]'
                                : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:-translate-y-0.5 hover:-translate-x-0.5'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="px-6 py-3 rounded-xl border-4 border-black dark:border-white text-black dark:text-white font-black hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.7)] hover:-translate-y-0.5 hover:-translate-x-0.5 transform"
                      >
                        Siguiente
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 dark:bg-gray-900 rounded-full mb-4">
                  <Car className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No se encontraron vehículos</h3>
                <p className="text-gray-600 dark:text-gray-400">Intenta ajustando los filtros de búsqueda</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getMockVehicles(): Vehicle[] {
  return [
    {
      id: 1,
      brandId: 1,
      brand: { id: 1, name: 'Toyota', logo: '', country: 'Japón' },
      model: 'Camry 2024',
      year: 2024,
      typeId: 1,
      type: { id: 1, name: 'Sedan' },
      price: 650000,
      currency: 'MXN',
      fuelTypeId: 1,
      fuelType: { id: 1, name: 'Gasolina' },
      transmissionId: 2,
      transmission: { id: 2, name: 'Automática' },
      doors: 4,
      seats: 5,
      engineSize: 2.5,
      horsepower: 203,
      fuelEconomy: 15.2,
      tankCapacity: 60,
      cargoSpace: 450,
      imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
      safetyRating: 4.8
    },
    {
      id: 2,
      brandId: 2,
      brand: { id: 2, name: 'Mazda', logo: '', country: 'Japón' },
      model: 'CX-5 2024',
      year: 2024,
      typeId: 2,
      type: { id: 2, name: 'SUV' },
      price: 780000,
      currency: 'MXN',
      fuelTypeId: 1,
      fuelType: { id: 1, name: 'Gasolina' },
      transmissionId: 2,
      transmission: { id: 2, name: 'Automática' },
      doors: 5,
      seats: 5,
      engineSize: 2.5,
      horsepower: 187,
      fuelEconomy: 14.5,
      tankCapacity: 58,
      cargoSpace: 615,
      imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400',
      safetyRating: 4.9,
      features: ['Control Adaptativo', 'Asistente de Mantenimiento de Carril', 'Sensores de Estacionamiento']
    },
    {
      id: 3,
      brandId: 3,
      brand: { id: 3, name: 'Honda', logo: '', country: 'Japón' },
      model: 'CR-V 2024',
      year: 2024,
      typeId: 2,
      type: { id: 2, name: 'SUV' },
      price: 820000,
      currency: 'MXN',
      fuelTypeId: 1,
      fuelType: { id: 1, name: 'Gasolina' },
      transmissionId: 3,
      transmission: { id: 3, name: 'CVT' },
      doors: 5,
      seats: 7,
      engineSize: 1.5,
      horsepower: 190,
      fuelEconomy: 16.2,
      tankCapacity: 53,
      cargoSpace: 1113,
      imageUrl: 'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=400',
      safetyRating: 5.0
    }
  ]
}