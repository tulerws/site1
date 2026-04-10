import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useParallaxLayers() {
  const initialized = useRef(false)

  const init = useCallback(() => {
    if (initialized.current) return
    initialized.current = true

    const layers = document.querySelectorAll('[data-speed]')

    layers.forEach((layer) => {
      const htmlLayer = layer as HTMLElement
      const speed = parseFloat(htmlLayer.dataset.speed || '0')

      gsap.to(htmlLayer, {
        y: () => speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: htmlLayer,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(init, 200)
    return () => clearTimeout(timer)
  }, [init])
}
