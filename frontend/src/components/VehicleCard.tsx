import { Link } from 'react-router-dom'
import { Car, Fuel, Users, Settings, Star, TrendingUp, Zap } from 'lucide-react'
import { Vehicle } from '../types/vehicle'

interface VehicleCardProps {
  vehicle: Vehicle
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: vehicle.currency || 'MXN'
    }).format(price)
  }

  return (
    <Link to={`/vehiculo/${vehicle.id}`} className="block group">
      <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[10px_10px_0px_0px_rgba(37,99,235,1)] dark:hover:shadow-[10px_10px_0px_0px_rgba(37,99,235,0.5)] hover:-translate-y-1 hover:-translate-x-1 transform transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 border-b-4 border-black dark:border-white">
          {vehicle.imageUrl ? (
            <img
              src={vehicle.imageUrl}
              alt={`${vehicle.brand?.name} ${vehicle.model}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Car className="h-16 w-16 text-gray-400 dark:text-gray-600" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 right-3 flex gap-2">
            {vehicle.year >= new Date().getFullYear() && (
              <span className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-black rounded-full shadow-lg">
                NUEVO
              </span>
            )}
            {vehicle.fuelType?.name === 'Eléctrico' && (
              <span className="px-3 py-1 bg-blue-600 dark:bg-blue-400 text-white dark:text-black text-xs font-black rounded-full shadow-lg flex items-center gap-1">
                <Zap className="h-3 w-3" />
                ECO
              </span>
            )}
          </div>

          {/* Safety Rating */}
          {vehicle.safetyRating && (
            <div className="absolute bottom-3 left-3 bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xl border-2 border-white dark:border-black">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-black">{vehicle.safetyRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Brand and Model */}
          <div className="mb-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{vehicle.brand?.name}</p>
            <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {vehicle.model}
            </h3>
          </div>

          {/* Price */}
          <div className="mb-4">
            <p className="text-2xl font-black text-black dark:text-white">{formatPrice(vehicle.price)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{vehicle.year} • {vehicle.type?.name}</p>
          </div>

          {/* Key Features Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Fuel Type */}
            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Fuel className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{vehicle.fuelType?.name}</span>
            </div>

            {/* Transmission */}
            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{vehicle.transmission?.name}</span>
            </div>

            {/* Seats */}
            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{vehicle.seats} asientos</span>
            </div>

            {/* Fuel Economy */}
            {vehicle.fuelEconomy > 0 && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{vehicle.fuelEconomy} km/l</span>
              </div>
            )}
          </div>

          {/* Features Preview */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {vehicle.features.slice(0, 2).map((feature, index) => (
                <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full font-medium">
                  {feature}
                </span>
              ))}
              {vehicle.features.length > 2 && (
                <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full font-medium">
                  +{vehicle.features.length - 2} más
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="px-5 pb-5 pt-0">
          <button className="w-full px-4 py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-black rounded-xl hover:bg-blue-600 dark:hover:bg-blue-400 transition-all shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.7)] hover:-translate-y-0.5 hover:-translate-x-0.5 transform">
            VER DETALLES
          </button>
        </div>
      </div>
    </Link>
  )
}