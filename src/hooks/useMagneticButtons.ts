import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'

export function useMagneticButtons() {
  const initialized = useRef(false)

  const init = useCallback(() => {
    if (initialized.current) return
    initialized.current = true

    const handleElements = () => {
      const buttons = document.querySelectorAll('.magnetic-btn')

      buttons.forEach((btn) => {
        const htmlBtn = btn as HTMLElement
        if (htmlBtn.dataset.magneticInit) return
        htmlBtn.dataset.magneticInit = 'true'

        const strength = 0.35
        const returnDuration = 0.6

        const onMove = (e: MouseEvent) => {
          const rect = htmlBtn.getBoundingClientRect()
          const cx = rect.left + rect.width / 2
          const cy = rect.top + rect.height / 2
          const dx = e.clientX - cx
          const dy = e.clientY - cy
          const dist = Math.sqrt(dx * dx + dy * dy)
          const radius = Math.max(rect.width, rect.height) * 0.8

          if (dist < radius) {
            gsap.to(htmlBtn, {
              x: dx * strength,
              y: dy * strength,
              duration: 0.3,
              ease: 'power2.out',
            })
          }
        }

        const onLeave = () => {
          gsap.to(htmlBtn, {
            x: 0,
            y: 0,
            duration: returnDuration,
            ease: 'elastic.out(1, 0.3)',
          })
        }

        htmlBtn.addEventListener('mousemove', onMove)
        htmlBtn.addEventListener('mouseleave', onLeave)
      })
    }

    handleElements()

    // Observe for dynamically added elements
    const observer = new MutationObserver(() => handleElements())
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const timer = setTimeout(init, 200)
    return () => clearTimeout(timer)
  }, [init])
}
