import { Link } from 'react-router-dom'
import { Search, Bot, TrendingUp, Shield, Zap, Users, Star, ArrowRight, Car, CheckCircle, ChevronRight } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Bot,
      title: 'IA Inteligente',
      description: 'Asistente personalizado que aprende de tus preferencias'
    },
    {
      icon: Search,
      title: 'Búsqueda Avanzada',
      description: 'Filtros inteligentes con más de 20 características'
    },
    {
      icon: TrendingUp,
      title: 'Comparador',
      description: 'Análisis lado a lado de hasta 4 vehículos'
    },
    {
      icon: Shield,
      title: 'Información Confiable',
      description: 'Datos oficiales directamente de las marcas'
    }
  ]

  const stats = [
    { label: 'Vehículos', value: '500+' },
    { label: 'Marcas', value: '20+' },
    { label: 'Usuarios', value: '10k+' },
    { label: 'Rating', value: '4.8★' }
  ]

  return (
    <div className="bg-white dark:bg-black transition-colors duration-300">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 border-[40px] border-blue-600 dark:border-white opacity-5 dark:opacity-10 rounded-full -translate-x-48 -translate-y-48"></div>
          <div className="absolute top-1/2 right-0 w-[600px] h-[600px] border-[60px] border-black dark:border-white opacity-5 dark:opacity-10 rounded-full translate-x-1/2"></div>
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-600 dark:bg-white opacity-5 dark:opacity-10 rounded-full translate-y-40"></div>
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" style={{
          backgroundImage: `linear-gradient(black 2px, transparent 2px), linear-gradient(90deg, black 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>
        <div className="container-custom text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 mb-8 border-4 border-black dark:border-white bg-white dark:bg-black rounded-full shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_20px_50px_rgba(255,255,255,0.2)] transition-all hover:scale-105 transform">
            <span className="text-sm font-semibold dark:text-white">Plataforma #1 en México</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 text-black dark:text-white" style={{
            textShadow: '4px 4px 0px rgba(37, 99, 235, 0.2)'
          }}>
            Encuentra tu
            <span className="text-blue-600 dark:text-blue-400"> vehículo ideal</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-12">
            Tecnología de IA avanzada para ayudarte a encontrar el auto perfecto según tus necesidades y presupuesto
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/asistente" className="px-8 py-4 font-black text-white bg-black dark:bg-white dark:text-black rounded-2xl transition-all flex items-center gap-2 shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] dark:shadow-[6px_6px_0px_0px_rgba(37,99,235,0.5)] hover:shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(37,99,235,0.7)] hover:-translate-y-1 hover:-translate-x-1 transform border-2 border-black dark:border-white">
              <Bot className="w-5 h-5" />
              Hablar con IA
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/catalogo" className="px-8 py-4 font-black text-black dark:text-white bg-white dark:bg-black rounded-2xl transition-all flex items-center gap-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.7)] hover:-translate-y-1 hover:-translate-x-1 transform border-4 border-black dark:border-white">
              <Search className="w-5 h-5" />
              Explorar Catálogo
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 p-8 bg-white dark:bg-gray-900 rounded-3xl border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)]">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-xl transition-all">
                <div className="text-4xl font-black text-black dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
        {/* Top border decoration */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-black dark:bg-white"></div>
        <div className="absolute top-2 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400"></div>

        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-blue-600 dark:border-white rounded-full opacity-20 dark:opacity-30"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-black dark:bg-white rounded-full opacity-5 dark:opacity-10"></div>
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black dark:text-white">
              Todo lo que necesitas
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Herramientas diseñadas para hacer tu búsqueda más inteligente y efectiva
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white dark:bg-gray-900 p-8 border-4 border-black dark:border-white rounded-2xl transition-all hover:-translate-y-2 transform shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.7)]">
                <div className="w-16 h-16 bg-blue-600 dark:bg-white rounded-xl mb-6 flex items-center justify-center shadow-lg">
                  <feature.icon className="w-8 h-8 text-white dark:text-black" />
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 bg-white dark:bg-black relative overflow-hidden">
        {/* Pattern background */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 100px, black 100px, black 101px)`,
          }}></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-black dark:text-white">
                Tu vehículo ideal en <span className="text-black dark:text-white">3 pasos</span>
              </h2>

              <div className="space-y-6">
                {[
                  { title: 'Define tus necesidades', desc: 'Cuéntale a nuestra IA qué buscas' },
                  { title: 'Recibe recomendaciones', desc: 'Obtén opciones personalizadas al instante' },
                  { title: 'Compara y decide', desc: 'Analiza y elige con confianza' }
                ].map((item, index) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-black text-lg shadow-lg border-2 border-blue-600 dark:border-blue-400">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-black dark:text-white mb-1">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/asistente" className="px-8 py-4 bg-blue-600 dark:bg-white text-white dark:text-black font-black rounded-xl inline-flex items-center gap-2 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[7px_7px_0px_0px_rgba(255,255,255,0.7)] hover:-translate-y-1 hover:-translate-x-1 transform transition-all border-2 border-black dark:border-white">
                  Comenzar ahora
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white rounded-2xl p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.5)] relative">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-600 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold shadow-lg">
                DEMO
              </div>
              {/* Mock chat interface */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white dark:text-black" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex-1">
                    <p className="text-sm dark:text-white">¡Hola! ¿Qué tipo de vehículo buscas?</p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-black dark:bg-white text-white dark:text-black rounded-lg p-4 max-w-[80%]">
                    <p className="text-sm">Busco una SUV familiar</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white dark:text-black" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex-1">
                    <p className="text-sm dark:text-white mb-3">Te recomiendo:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded border-2 border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md hover:border-black dark:hover:border-white transition-all cursor-pointer">
                        <Car className="w-4 h-4 text-black dark:text-white" />
                        <span className="text-sm font-medium dark:text-white">Mazda CX-5</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded border-2 border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md hover:border-black dark:hover:border-white transition-all cursor-pointer">
                        <Car className="w-4 h-4 text-black dark:text-white" />
                        <span className="text-sm font-medium dark:text-white">Honda CR-V</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 relative bg-gradient-to-t from-white to-gray-50 dark:from-black dark:to-gray-900">
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-black via-blue-600 to-black dark:from-white dark:via-blue-400 dark:to-white"></div>
        <div className="container-custom text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-black dark:text-white">
            ¿Por qué elegir AutoMatch?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Información Confiable', desc: 'Datos oficiales de las marcas' },
              { icon: Zap, title: 'Respuestas Instantáneas', desc: 'IA que responde en segundos' },
              { icon: Users, title: 'Miles de Usuarios', desc: 'La comunidad más grande' }
            ].map((benefit) => (
              <div key={benefit.title}>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-black dark:from-white dark:to-blue-400 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl">
                  <benefit.icon className="w-10 h-10 text-white dark:text-black" />
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black dark:bg-white text-white dark:text-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black dark:from-white dark:via-gray-100 dark:to-white opacity-50"></div>
        <div className="container-custom text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para encontrar tu vehículo ideal?
          </h2>
          <p className="text-xl text-gray-300 dark:text-gray-700 max-w-2xl mx-auto mb-8">
            Miles de usuarios ya encontraron su match perfecto. Es tu turno.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/asistente" className="px-6 py-3 font-semibold bg-white dark:bg-black text-black dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transform inline-flex items-center">
              <Bot className="w-5 h-5 mr-2" />
              Iniciar con IA
            </Link>
            <Link to="/catalogo" className="px-6 py-3 font-semibold border-2 border-white dark:border-black text-white dark:text-black rounded-lg hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform inline-flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Ver Catálogo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}