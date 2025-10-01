import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { getFilters } from '../services/vehicleService'

interface FilterSidebarProps {
  filters: {
    query: string
    brandIds: number[]
    typeIds: number[]
    fuelTypeIds: number[]
    transmissionIds: number[]
    priceMin: number
    priceMax: number
    yearMin: number
    yearMax: number
    doorsMin: number
    seatsMin: number
    fuelEconomyMin: number
    sortBy: string
  }
  onFilterChange: (filters: any) => void
  onClear: () => void
}

interface FilterOption {
  id: number
  name: string
  count?: number
}

export default function FilterSidebar({ filters, onFilterChange, onClear }: FilterSidebarProps) {
  const [brands, setBrands] = useState<FilterOption[]>([])
  const [vehicleTypes, setVehicleTypes] = useState<FilterOption[]>([])
  const [fuelTypes, setFuelTypes] = useState<FilterOption[]>([])
  const [transmissions, setTransmissions] = useState<FilterOption[]>([])
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    type: true,
    fuel: true,
    transmission: true,
    price: true,
    year: false,
    features: false
  })

  useEffect(() => {
    loadFilterOptions()
  }, [])

  const loadFilterOptions = async () => {
    try {
      const data = await getFilters()
      setBrands(data.brands || [])
      setVehicleTypes(data.vehicle_types || [])
      setFuelTypes(data.fuel_types || [])
      setTransmissions(data.transmissions || [])
    } catch (error) {
      // Use mock data for demo
      setBrands([
        { id: 1, name: 'Toyota', count: 15 },
        { id: 2, name: 'Mazda', count: 12 },
        { id: 3, name: 'Honda', count: 10 },
        { id: 4, name: 'Nissan', count: 14 },
        { id: 5, name: 'Volkswagen', count: 8 }
      ])
      setVehicleTypes([
        { id: 1, name: 'Sedan', count: 25 },
        { id: 2, name: 'SUV', count: 30 },
        { id: 3, name: 'Pickup', count: 15 },
        { id: 4, name: 'Hatchback', count: 10 }
      ])
      setFuelTypes([
        { id: 1, name: 'Gasolina', count: 60 },
        { id: 2, name: 'Diesel', count: 15 },
        { id: 3, name: 'Híbrido', count: 10 },
        { id: 4, name: 'Eléctrico', count: 5 }
      ])
      setTransmissions([
        { id: 1, name: 'Manual', count: 35 },
        { id: 2, name: 'Automática', count: 45 },
        { id: 3, name: 'CVT', count: 10 }
      ])
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }))
  }

  const handleCheckboxChange = (type: string, id: number) => {
    const key = `${type}Ids` as keyof typeof filters
    const currentIds = filters[key] as number[]
    const newIds = currentIds.includes(id)
      ? currentIds.filter(item => item !== id)
      : [...currentIds, id]

    onFilterChange({
      ...filters,
      [key]: newIds
    })
  }

  const priceRanges = [
    { label: 'Menos de $300,000', min: 0, max: 300000 },
    { label: '$300,000 - $500,000', min: 300000, max: 500000 },
    { label: '$500,000 - $800,000', min: 500000, max: 800000 },
    { label: '$800,000 - $1,200,000', min: 800000, max: 1200000 },
    { label: 'Más de $1,200,000', min: 1200000, max: 0 }
  ]

  const yearRanges = [
    { label: '2024', min: 2024, max: 2024 },
    { label: '2023', min: 2023, max: 2023 },
    { label: '2022', min: 2022, max: 2022 },
    { label: '2020 - 2021', min: 2020, max: 2021 },
    { label: 'Antes de 2020', min: 0, max: 2019 }
  ]

  const hasActiveFilters = filters.brandIds.length > 0 ||
    filters.typeIds.length > 0 ||
    filters.fuelTypeIds.length > 0 ||
    filters.transmissionIds.length > 0 ||
    filters.priceMin > 0 ||
    filters.priceMax > 0 ||
    filters.yearMin > 0 ||
    filters.yearMax > 0

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-4 border-black dark:border-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.7)] transition-all">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-gray-900 dark:text-white">FILTROS</h2>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-black"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Brand Filter */}
      <div className="border-b-2 border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <button
          onClick={() => toggleSection('brand')}
          className="flex justify-between items-center w-full text-left group"
        >
          <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-sm">Marca</h3>
          {expandedSections.brand ? (
            <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
          )}
        </button>
        {expandedSections.brand && (
          <div className="mt-3 space-y-2">
            {brands.map(brand => (
              <label key={brand.id} className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-all group">
                <input
                  type="checkbox"
                  checked={filters.brandIds.includes(brand.id)}
                  onChange={() => handleCheckboxChange('brand', brand.id)}
                  className="mr-3 w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400 transition-all"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 group-hover:text-black dark:group-hover:text-white">{brand.name}</span>
                {brand.count && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-black bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">{brand.count}</span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Vehicle Type Filter */}
      <div className="border-b-2 border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <button
          onClick={() => toggleSection('type')}
          className="flex justify-between items-center w-full text-left group"
        >
          <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-sm">Tipo de Vehículo</h3>
          {expandedSections.type ? (
            <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
          )}
        </button>
        {expandedSections.type && (
          <div className="mt-3 space-y-2">
            {vehicleTypes.map(type => (
              <label key={type.id} className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-all group">
                <input
                  type="checkbox"
                  checked={filters.typeIds.includes(type.id)}
                  onChange={() => handleCheckboxChange('type', type.id)}
                  className="mr-3 w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400 transition-all"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 group-hover:text-black dark:group-hover:text-white">{type.name}</span>
                {type.count && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-black bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">{type.count}</span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Fuel Type Filter */}
      <div className="border-b-2 border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <button
          onClick={() => toggleSection('fuel')}
          className="flex justify-between items-center w-full text-left group"
        >
          <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-sm">Combustible</h3>
          {expandedSections.fuel ? (
            <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
          )}
        </button>
        {expandedSections.fuel && (
          <div className="mt-3 space-y-2">
            {fuelTypes.map(fuel => (
              <label key={fuel.id} className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-all group">
                <input
                  type="checkbox"
                  checked={filters.fuelTypeIds.includes(fuel.id)}
                  onChange={() => handleCheckboxChange('fuelType', fuel.id)}
                  className="mr-3 w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400 transition-all"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 group-hover:text-black dark:group-hover:text-white">{fuel.name}</span>
                {fuel.count && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-black bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">{fuel.count}</span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Transmission Filter */}
      <div className="border-b-2 border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <button
          onClick={() => toggleSection('transmission')}
          className="flex justify-between items-center w-full text-left group"
        >
          <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-sm">Transmisión</h3>
          {expandedSections.transmission ? (
            <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
          )}
        </button>
        {expandedSections.transmission && (
          <div className="mt-3 space-y-2">
            {transmissions.map(trans => (
              <label key={trans.id} className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-all group">
                <input
                  type="checkbox"
                  checked={filters.transmissionIds.includes(trans.id)}
                  onChange={() => handleCheckboxChange('transmission', trans.id)}
                  className="mr-3 w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400 transition-all"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 group-hover:text-black dark:group-hover:text-white">{trans.name}</span>
                {trans.count && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-black bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">{trans.count}</span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="border-b-2 border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex justify-between items-center w-full text-left group"
        >
          <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-sm">Precio</h3>
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
          )}
        </button>
        {expandedSections.price && (
          <div className="mt-3 space-y-2">
            {priceRanges.map((range, index) => (
              <label key={index} className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-all group">
                <input
                  type="radio"
                  name="priceRange"
                  checked={filters.priceMin === range.min && (range.max === 0 || filters.priceMax === range.max)}
                  onChange={() => onFilterChange({
                    ...filters,
                    priceMin: range.min,
                    priceMax: range.max
                  })}
                  className="mr-3 w-5 h-5 text-blue-600 dark:text-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400 border-2 border-gray-300 dark:border-gray-600"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Year Filter */}
      <div>
        <button
          onClick={() => toggleSection('year')}
          className="flex justify-between items-center w-full text-left group"
        >
          <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-sm">Año</h3>
          {expandedSections.year ? (
            <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
          )}
        </button>
        {expandedSections.year && (
          <div className="mt-3 space-y-2">
            {yearRanges.map((range, index) => (
              <label key={index} className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-all group">
                <input
                  type="radio"
                  name="yearRange"
                  checked={
                    (range.min === 0 ? filters.yearMin === 0 : filters.yearMin === range.min) &&
                    (range.max === 0 ? filters.yearMax === 0 : filters.yearMax === range.max)
                  }
                  onChange={() => onFilterChange({
                    ...filters,
                    yearMin: range.min,
                    yearMax: range.max
                  })}
                  className="mr-3 w-5 h-5 text-blue-600 dark:text-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400 border-2 border-gray-300 dark:border-gray-600"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}