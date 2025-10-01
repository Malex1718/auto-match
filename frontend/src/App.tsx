import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import VehicleDetailPage from './pages/VehicleDetailPage'
import AIAssistantPage from './pages/AIAssistantPage'
import ComparePage from './pages/ComparePage'
import { useTheme } from './hooks/useTheme'

function App() {
  useTheme() // Aplicar detección automática del tema
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="catalogo" element={<CatalogPage />} />
        <Route path="vehiculo/:id" element={<VehicleDetailPage />} />
        <Route path="asistente" element={<AIAssistantPage />} />
        <Route path="comparar" element={<ComparePage />} />
      </Route>
    </Routes>
  )
}

export default App