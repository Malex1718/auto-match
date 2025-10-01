import { useState } from 'react'
import { Plus, X, Check, Minus } from 'lucide-react'
import { Vehicle } from '../types/vehicle'

export default function ComparePage() {
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([])
  const maxVehicles = 4

  // Mock vehicles for demo
  const mockVehicles: Vehicle[] = [
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
      torque: 250,
      fuelEconomy: 15.2,
      tankCapacity: 60,
      cargoSpace: 450,
      imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
      safetyRating: 4.8
    },
    {
      id: 2,
      brandId: 3,
      brand: { id: 3, name: 'Honda', logo: '', country: 'Japón' },
      model: 'Accord 2024',
      year: 2024,
      typeId: 1,
      type: { id: 1, name: 'Sedan' },
      price: 680000,
      currency: 'MXN',
      fuelTypeId: 1,
      fuelType: { id: 1, name: 'Gasolina' },
      transmissionId: 3,
      transmission: { id: 3, name: 'CVT' },
      doors: 4,
      seats: 5,
      engineSize: 1.5,
      horsepower: 192,
      torque: 260,
      fuelEconomy: 16.8,
      tankCapacity: 56,
      cargoSpace: 473,
      imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400',
      safetyRating: 4.9
    }
  ]

  const addVehicle = (vehicle: Vehicle) => {
    if (selectedVehicles.length < maxVehicles) {
      setSelectedVehicles([...selectedVehicles, vehicle])
    }
  }

  const removeVehicle = (vehicleId: number) => {
    setSelectedVehicles(selectedVehicles.filter(v => v.id !== vehicleId))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price)
  }

  const compareValue = (values: any[], type: 'number' | 'text' = 'number') => {
    if (type === 'number') {
      const nums = values.filter(v => v !== undefined && v !== null).map(Number)
      const max = Math.max(...nums)
      const min = Math.min(...nums)
      return { max, min, hasVariation: max !== min }
    }
    return { hasVariation: false }
  }

  // Specifications to compare
  const specifications = [
    { label: 'Precio', key: 'price', format: (v: any) => formatPrice(v), type: 'number' },
    { label: 'Año', key: 'year', format: (v: any) => v, type: 'number' },
    { label: 'Tipo', key: 'type', format: (v: any) => v?.name, type: 'text' },
    { label: 'Combustible', key: 'fuelType', format: (v: any) => v?.name, type: 'text' },
    { label: 'Transmisión', key: 'transmission', format: (v: any) => v?.name, type: 'text' },
    { label: 'Motor', key: 'engineSize', format: (v: any) => `${v}L`, type: 'number' },
    { label: 'Potencia', key: 'horsepower', format: (v: any) => `${v} HP`, type: 'number' },
    { label: 'Torque', key: 'torque', format: (v: any) => `${v} Nm`, type: 'number' },
    { label: 'Rendimiento', key: 'fuelEconomy', format: (v: any) => `${v} km/l`, type: 'number' },
    { label: 'Tanque', key: 'tankCapacity', format: (v: any) => `${v}L`, type: 'number' },
    { label: 'Cajuela', key: 'cargoSpace', format: (v: any) => `${v}L`, type: 'number' },
    { label: 'Puertas', key: 'doors', format: (v: any) => v, type: 'number' },
    { label: 'Asientos', key: 'seats', format: (v: any) => v, type: 'number' },
    { label: 'Calificación Seguridad', key: 'safetyRating', format: (v: any) => v ? `${v}/5` : 'N/A', type: 'number' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Comparador de Vehículos</h1>
          <p className="text-gray-600">Compara hasta {maxVehicles} vehículos lado a lado</p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-700 bg-gray-50 sticky left-0 z-10">
                    Especificación
                  </th>
                  {[...Array(maxVehicles)].map((_, index) => (
                    <th key={index} className="p-4 min-w-[250px]">
                      {selectedVehicles[index] ? (
                        <div className="relative">
                          <button
                            onClick={() => removeVehicle(selectedVehicles[index].id)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <img
                            src={selectedVehicles[index].imageUrl || '/placeholder-car.jpg'}
                            alt={selectedVehicles[index].model}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                          <p className="text-sm text-gray-500">{selectedVehicles[index].brand?.name}</p>
                          <p className="font-semibold text-gray-900">{selectedVehicles[index].model}</p>
                        </div>
                      ) : (
                        <div className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-black transition-all hover:shadow-inner cursor-pointer">
                          <Plus className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Agregar vehículo</p>
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specifications.map((spec, index) => {
                  const values = selectedVehicles.map(v => v[spec.key as keyof Vehicle])
                  const comparison = spec.type === 'number' ? compareValue(values, 'number') : { hasVariation: false }
                  
                  return (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-4 font-medium text-gray-700 sticky left-0 z-10 bg-inherit">
                        {spec.label}
                      </td>
                      {[...Array(maxVehicles)].map((_, vIndex) => {
                        const vehicle = selectedVehicles[vIndex]
                        if (!vehicle) {
                          return <td key={vIndex} className="p-4 text-center text-gray-400">-</td>
                        }
                        
                        const value = vehicle[spec.key as keyof Vehicle]
                        const formattedValue = spec.format(value)
                        const numValue = spec.type === 'number' ? Number(value) : null
                        
                        let highlight = ''
                        if (spec.type === 'number' && comparison.hasVariation && numValue !== null) {
                          if (spec.key === 'price') {
                            // Lower price is better
                            highlight = numValue === comparison.min ? 'text-blue-600 font-semibold' : ''
                          } else if (['fuelEconomy', 'horsepower', 'torque', 'cargoSpace', 'safetyRating'].includes(spec.key)) {
                            // Higher is better
                            highlight = numValue === comparison.max ? 'text-blue-600 font-semibold' : ''
                          }
                        }
                        
                        return (
                          <td key={vIndex} className={`p-4 text-center ${highlight}`}>
                            {formattedValue}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Vehicles Section */}
        {selectedVehicles.length < maxVehicles && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Vehículos Disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockVehicles.filter(v => !selectedVehicles.find(sv => sv.id === v.id)).map(vehicle => (
                <div key={vehicle.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl p-4 border-2 border-gray-200 hover:border-black transition-all hover:-translate-y-0.5 transform">
                  <img
                    src={vehicle.imageUrl || '/placeholder-car.jpg'}
                    alt={vehicle.model}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <p className="text-sm text-gray-500">{vehicle.brand?.name}</p>
                  <p className="font-semibold text-gray-900 mb-2">{vehicle.model}</p>
                  <p className="text-black font-semibold mb-3">{formatPrice(vehicle.price)}</p>
                  <button
                    onClick={() => addVehicle(vehicle)}
                    className="w-full px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-900 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 transform"
                  >
                    Agregar a Comparación
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedVehicles.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 shadow-lg">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Comienza a Comparar</h3>
            <p className="text-gray-600 mb-6">Selecciona hasta {maxVehicles} vehículos para comparar sus características</p>
            <div className="flex justify-center gap-4">
              {mockVehicles.slice(0, 2).map(vehicle => (
                <button
                  key={vehicle.id}
                  onClick={() => addVehicle(vehicle)}
                  className="bg-white rounded-lg shadow-lg p-4 text-left hover:shadow-2xl transition-all border-2 border-gray-200 hover:border-black hover:-translate-y-0.5 transform"
                >
                  <img
                    src={vehicle.imageUrl || '/placeholder-car.jpg'}
                    alt={vehicle.model}
                    className="w-48 h-32 object-cover rounded-lg mb-2"
                  />
                  <p className="text-sm text-gray-500">{vehicle.brand?.name}</p>
                  <p className="font-semibold text-gray-900">{vehicle.model}</p>
                  <p className="text-black font-semibold">{formatPrice(vehicle.price)}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}