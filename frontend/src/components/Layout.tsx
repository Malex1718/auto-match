import { Outlet, Link, useLocation } from 'react-router-dom'
import { Car, Bot, Search, BarChart3, Menu, X, Home } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Layout() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => location.pathname === path

  const navigation = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Catálogo', href: '/catalogo', icon: Search },
    { name: 'Asistente IA', href: '/asistente', icon: Bot },
    { name: 'Comparar', href: '/comparar', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white dark:bg-black ${
        scrolled ? 'shadow-lg border-b-2 border-gray-100 dark:border-gray-800' : 'shadow-md'
      }`}>
        <nav className="container-custom">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-blue-600 dark:bg-white p-2.5 rounded-xl border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:group-hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.7)] group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 transform transition-all">
                <Car className="h-6 w-6 text-white dark:text-black" />
              </div>
              <span className="text-xl font-black text-black dark:text-white tracking-tight">AUTOMATCH</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-black rounded-xl border-2 transition-all ${
                    isActive(item.href)
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]'
                      : 'text-black dark:text-white border-transparent hover:border-black dark:hover:border-white hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.5)] hover:-translate-y-0.5 hover:-translate-x-0.5 transform'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden md:block">
              <Link to="/asistente" className="inline-block px-6 py-3 bg-blue-600 dark:bg-white text-white dark:text-black text-sm font-black rounded-xl border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.7)] hover:-translate-y-0.5 hover:-translate-x-0.5 transform transition-all uppercase tracking-wider">
                EMPEZAR AHORA
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl border-4 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.7)] hover:-translate-y-0.5 hover:-translate-x-0.5 transform transition-all text-black dark:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 bg-white dark:bg-black border-t-2 border-gray-200 dark:border-gray-800 shadow-lg">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-black ${
                    isActive(item.href)
                      ? 'text-white bg-black dark:text-black dark:bg-white'
                      : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900'
                  } transition-all`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="px-4 pt-4 mt-4 border-t border-gray-200">
                <Link to="/asistente" className="block w-full px-6 py-3 bg-blue-600 dark:bg-white text-white dark:text-black text-sm font-black text-center rounded-xl border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] uppercase tracking-wider">
                  EMPEZAR AHORA
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="h-20"></div>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-black dark:bg-white text-white dark:text-black relative transition-colors duration-300 border-t-4 border-black dark:border-white">
        <div className="container-custom py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white dark:bg-black p-2.5 rounded-xl border-2 border-white dark:border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <Car className="h-6 w-6 text-black dark:text-white" />
                </div>
                <span className="text-2xl font-black tracking-tight">AUTOMATCH</span>
              </div>
              <p className="text-gray-400 dark:text-gray-600 mb-6 max-w-md">
                La plataforma más avanzada para encontrar tu vehículo ideal usando inteligencia artificial.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-black mb-4 uppercase tracking-wider">Enlaces</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/catalogo" className="text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-black">
                    Catálogo
                  </Link>
                </li>
                <li>
                  <Link to="/asistente" className="text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-black">
                    Asistente IA
                  </Link>
                </li>
                <li>
                  <Link to="/comparar" className="text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-black">
                    Comparador
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-black mb-4 uppercase tracking-wider">Soporte</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-black">
                    Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-black">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-black">
                    Privacidad
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 dark:border-gray-300 pt-8 text-center">
            <p className="text-gray-400 dark:text-gray-600 text-sm">
              © 2024 AutoMatch. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}