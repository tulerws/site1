import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface FleeingTextProps {
  text: string
  className?: string
}

export default function FleeingText({ text, className = '' }: FleeingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Cache letter positions — update only on resize/scroll
    let letterPositions: { x: number; y: number }[] = []
    const cachePositions = () => {
      letterPositions = lettersRef.current.map((letter) => {
        if (!letter) return { x: 0, y: 0 }
        const rect = letter.getBoundingClientRect()
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      })
    }
    cachePositions()
    window.addEventListener('scroll', cachePositions, { passive: true })
    window.addEventListener('resize', cachePositions, { passive: true })

    let lastMoveTime = 0
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastMoveTime < 30) return // ~33fps throttle
      lastMoveTime = now

      const mouseX = e.clientX
      const mouseY = e.clientY

      lettersRef.current.forEach((letter, index) => {
        if (!letter) return

        const pos = letterPositions[index]
        if (!pos) return
        const letterX = pos.x
        const letterY = pos.y

        const distX = mouseX - letterX
        const distY = mouseY - letterY
        const distance = Math.sqrt(distX * distX + distY * distY)

        const radius = 120 // Distance of impact

        if (distance < radius) {
          // Calculate repulsion force
          const force = (radius - distance) / radius
          const angle = Math.atan2(distY, distX)

          const pushX = -Math.cos(angle) * force * 50
          const pushY = -Math.sin(angle) * force * 50

          gsap.to(letter, {
            x: pushX,
            y: pushY,
            scale: 1.1 + force * 0.2,
            duration: 0.4,
            ease: 'power3.out',
            overwrite: 'auto'
          })
        } else {
          // Reset position if outside radius
          gsap.to(letter, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'elastic.out(1, 0.3)',
            overwrite: 'auto'
          })
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', cachePositions)
      window.removeEventListener('resize', cachePositions)
    }
  }, [])

  // Split text into words and then letters to preserve word breaking
  const words = text.split(' ')

  return (
    <div ref={containerRef} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, wordIndex) => (
        <div key={wordIndex} className="inline-flex mr-[0.25em] last:mr-0">
          {word.split('').map((char, charIndex) => {
            const index = wordIndex * 100 + charIndex // Unique enough index
            return (
              <span
                key={index}
                ref={(el) => (lettersRef.current[index] = el)}
                className="inline-block relative"
                style={{ transformOrigin: 'center center' }}
              >
                {char}
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}
