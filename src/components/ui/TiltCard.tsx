import { useRef, useState } from 'react'
import gsap from 'gsap'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  glareColor?: string
  tiltIntensity?: number
}

export default function TiltCard({
  children,
  className = '',
  glareColor = 'rgba(127, 166, 83, 0.07)',
  tiltIntensity = 15,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current
    const glare = glareRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    // Normalize to -1 to 1
    const normalX = mouseX / (rect.width / 2)
    const normalY = mouseY / (rect.height / 2)

    // Tilt: mouse on left edge → tilt right (positive rotateY), top edge → tilt down (negative rotateX)
    const rotateY = normalX * tiltIntensity
    const rotateX = -normalY * tiltIntensity

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 800,
    })

    // Move glare to follow mouse
    if (glare) {
      gsap.to(glare, {
        x: mouseX * 0.3,
        y: mouseY * 0.3,
        opacity: 0.8,
        duration: 0.4,
        ease: 'power2.out',
      })
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    const card = cardRef.current
    if (!card) return
    gsap.to(card, {
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    const card = cardRef.current
    const glare = glareRef.current
    if (!card) return

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out',
    })

    if (glare) {
      gsap.to(glare, {
        x: 0,
        y: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      })
    }
  }

  return (
    <div
      style={{ perspective: '800px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor-hover
    >
      <div
        ref={cardRef}
        className={`relative glass-card rounded-2xl overflow-hidden transition-colors duration-500 ${className}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Glare / light follow */}
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 z-10 opacity-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle at center, ${glareColor} 0%, transparent 70%)`,
            width: '150%',
            height: '150%',
            top: '-25%',
            left: '-25%',
          }}
        />

        {/* Content */}
        <div className="relative z-20" style={{ transform: 'translateZ(20px)' }}>
          {children}
        </div>

        {/* Edge highlight on hover */}
        <div
          className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            boxShadow: `inset 0 0 30px rgba(127, 166, 83, 0.03), 0 0 50px rgba(127, 166, 83, 0.04)`,
          }}
        />
      </div>
    </div>
  )
}
