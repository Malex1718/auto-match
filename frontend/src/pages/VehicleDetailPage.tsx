import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, Shield, Fuel, Settings, Users, Gauge, Package, Calendar } from 'lucide-react'
import { Vehicle } from '../types/vehicle'
import { getVehicleById } from '../services/vehicleService'

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (id) {
      loadVehicle(parseInt(id))
    }
  }, [id])

  const loadVehicle = async (vehicleId: number) => {
    setLoading(true)
    try {
      const data = await getVehicleById(vehicleId)
      setVehicle(data)
    } catch (error) {
      // Use mock data for demo
      setVehicle(getMockVehicle())
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: vehicle?.currency || 'MXN'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehículo no encontrado</h2>
          <Link to="/catalogo" className="text-blue-600 hover:text-blue-700">
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  const images = [
    vehicle.imageUrl,
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800'
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b-2 border-gray-100 shadow-md">
        <div className="container-custom py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Inicio</Link>
            <span className="text-gray-400">/</span>
            <Link to="/catalogo" className="text-gray-500 hover:text-gray-700">Catálogo</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{vehicle.brand?.name} {vehicle.model}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div>
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl border-2 border-gray-200">
              <div className="relative aspect-video">
                <img
                  src={images[selectedImage] || '/placeholder-car.jpg'}
                  alt={`${vehicle.brand?.name} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
                {vehicle.safetyRating && (
                  <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-white" />
                    <span className="font-medium">Seguridad: {vehicle.safetyRating}/5</span>
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all shadow-sm hover:shadow-md ${
                        selectedImage === index ? 'border-black shadow-lg' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="bg-white rounded-xl p-6 mt-6 shadow-xl border-2 border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Características Destacadas</h3>
                <div className="grid grid-cols-2 gap-3">
                  {vehicle.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div>
            {/* Main Info */}
            <div className="bg-white rounded-xl p-6 shadow-2xl border-2 border-gray-200">
              <div className="mb-4">
                <p className="text-sm text-gray-500 font-medium">{vehicle.brand?.name}</p>
                <h1 className="text-3xl font-bold text-gray-900">{vehicle.model}</h1>
                <p className="text-gray-600">{vehicle.year} • {vehicle.type?.name}</p>
              </div>

              <div className="mb-6">
                <p className="text-3xl font-bold text-black">{formatPrice(vehicle.price)}</p>
                <p className="text-sm text-gray-500">Precio sugerido</p>
              </div>

              <div className="flex gap-3 mb-6">
                <button className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
                  Solicitar Cotización
                </button>
                <button className="p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-black transition-all shadow-sm hover:shadow-md">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-black transition-all shadow-sm hover:shadow-md">
                  <Share2 className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200 shadow-inner">
                <div className="flex items-center gap-3">
                  <Fuel className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Combustible</p>
                    <p className="text-sm font-medium">{vehicle.fuelType?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Transmisión</p>
                    <p className="text-sm font-medium">{vehicle.transmission?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Capacidad</p>
                    <p className="text-sm font-medium">{vehicle.seats} asientos</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Gauge className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Rendimiento</p>
                    <p className="text-sm font-medium">{vehicle.fuelEconomy} km/l</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl p-6 mt-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Especificaciones Técnicas</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Motor y Rendimiento</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-500">Motor</span>
                      <span className="font-medium">{vehicle.engineSize}L</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-500">Potencia</span>
                      <span className="font-medium">{vehicle.horsepower} HP</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-500">Torque</span>
                      <span className="font-medium">{vehicle.torque} Nm</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-500">Rendimiento</span>
                      <span className="font-medium">{vehicle.fuelEconomy} km/l</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Dimensiones y Capacidad</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-500">Puertas</span>
                      <span className="font-medium">{vehicle.doors}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-500">Asientos</span>
                      <span className="font-medium">{vehicle.seats}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-500">Tanque</span>
                      <span className="font-medium">{vehicle.tankCapacity}L</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-500">Cajuela</span>
                      <span className="font-medium">{vehicle.cargoSpace}L</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {vehicle.description && (
              <div className="bg-white rounded-xl p-6 mt-6 shadow-xl border-2 border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Descripción</h3>
                <p className="text-gray-700 leading-relaxed">{vehicle.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getMockVehicle(): Vehicle {
  return {
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
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    description: 'El Toyota Camry 2024 redefine el concepto de sedan ejecutivo con su diseño elegante, tecnología avanzada y eficiencia excepcional. Equipado con un motor de 2.5 litros que ofrece un equilibrio perfecto entre potencia y economía de combustible.',
    features: [
      'Control de crucero adaptativo',
      'Sistema de audio JBL Premium',
      'Apple CarPlay y Android Auto',
      'Asientos de cuero con calefacción',
      'Techo panorámico',
      'Sistema de seguridad Toyota Safety Sense',
      'Cámara de reversa con líneas guía',
      'Sensores de estacionamiento',
      'Faros LED automáticos',
      'Sistema de navegación GPS'
    ],
    safetyRating: 4.8
  }
}