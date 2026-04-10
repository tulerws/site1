import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'

export function useTextScramble() {
  const initialized = useRef(false)

  const init = useCallback(() => {
    if (initialized.current) return
    initialized.current = true

    const elements = document.querySelectorAll('.scramble-title')

    elements.forEach((el) => {
      const htmlEl = el as HTMLElement
      const originalText = htmlEl.textContent || ''

      ScrollTrigger.create({
        trigger: htmlEl,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          let iteration = 0
          const totalIterations = 12
          const textLen = originalText.length

          const interval = setInterval(() => {
            htmlEl.textContent = originalText
              .split('')
              .map((char, i) => {
                if (char === ' ') return ' '
                if (i < (iteration / totalIterations) * textLen) return originalText[i]
                return CHARS[Math.floor(Math.random() * CHARS.length)]
              })
              .join('')

            iteration++
            if (iteration > totalIterations) {
              clearInterval(interval)
              htmlEl.textContent = originalText
            }
          }, 40)
        },
      })
    })
  }, [])

  useEffect(() => {
    // Delay to let DOM render
    const timer = setTimeout(init, 100)
    return () => clearTimeout(timer)
  }, [init])
}
