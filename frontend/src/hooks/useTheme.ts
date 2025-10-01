import { useEffect } from 'react'

export function useTheme() {
  useEffect(() => {
    // Función para aplicar el tema
    const applyTheme = (isDark: boolean) => {
      console.log('useTheme: Aplicando tema oscuro:', isDark)
      const root = document.documentElement

      if (isDark) {
        root.classList.add('dark')
        console.log('useTheme: Clase dark añadida')
      } else {
        root.classList.remove('dark')
        console.log('useTheme: Clase dark removida')
      }

      // Forzar re-renderizado en caso de que no se aplique
      root.style.colorScheme = isDark ? 'dark' : 'light'
      console.log('useTheme: Clases actuales:', root.className)
    }

    // Detectar preferencia inicial del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    console.log('useTheme: Media query matches:', mediaQuery.matches)
    applyTheme(mediaQuery.matches)

    // Escuchar cambios en la preferencia del sistema
    const handleChange = (e: MediaQueryListEvent) => {
      console.log('useTheme: Cambio detectado:', e.matches)
      applyTheme(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])
}