import { useEffect } from 'react'

export function useVariableFont() {
  useEffect(() => {
    let ticking = false
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const x = e.clientX / window.innerWidth
          const y = e.clientY / window.innerHeight
          
          // Cabinet Grotesk weight variable axis maps from 100 to 900
          // Mapping according to mouse X position for example
          const weight = 100 + (x * 800)
          
          // Apply to root CSS variable
          document.documentElement.style.setProperty('--font-weight', weight.toString())
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
}
