import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<(HTMLDivElement | null)[]>([])
  const [hoverLabel, setHoverLabel] = useState('')

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    const trails = trailRefs.current.filter(Boolean) as HTMLDivElement[]
    if (!dot || !ring || !label) return

    // Hide the system cursor globally via a <style> tag
    const style = document.createElement('style')
    style.textContent = `
      *, *::before, *::after { cursor: none !important; }
    `
    document.head.appendChild(style)

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let isHovering = false
    let rafId: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    // Smooth trailing loop — direct style writes (faster than gsap.set per frame)
    const tick = () => {
      // Dot — follows immediately
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`

      // Ring — trails with spring
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`

      // Label
      label.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`

      // Trail particles
      trails.forEach((trail, i) => {
        const speed = 0.08 - i * 0.015
        const tData = (trail as any).__pos || { x: -100, y: -100 }
        const targetX = i === 0 ? mouseX : ((trails[i - 1] as any).__pos?.x ?? mouseX)
        const targetY = i === 0 ? mouseY : ((trails[i - 1] as any).__pos?.y ?? mouseY)
        tData.x += (targetX - tData.x) * speed
        tData.y += (targetY - tData.y) * speed
        ;(trail as any).__pos = tData
        trail.style.transform = `translate(${tData.x}px, ${tData.y}px) translate(-50%, -50%)`
      })

      rafId = requestAnimationFrame(tick)
    }

    // Init trail positions
    trails.forEach((trail) => {
      ;(trail as any).__pos = { x: -100, y: -100 }
    })

    const handleEnterInteractive = (e: Event) => {
      const el = e.currentTarget as HTMLElement
      isHovering = true
      const cursorLabel = el.getAttribute('data-cursor-label') || ''

      gsap.to(ring, {
        width: cursorLabel ? 80 : 60,
        height: cursorLabel ? 80 : 60,
        borderColor: 'rgba(127, 166, 83, 0.5)',
        duration: 0.4,
        ease: 'power3.out',
      })
      gsap.to(dot, { scale: 0.5, opacity: 0.5, duration: 0.3 })

      if (cursorLabel) {
        setHoverLabel(cursorLabel)
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.3 })
      }

      // Trail fade
      trails.forEach((trail) => {
        gsap.to(trail, { opacity: 0, duration: 0.3 })
      })
    }

    const handleLeaveInteractive = () => {
      isHovering = false
      setHoverLabel('')

      gsap.to(ring, {
        width: 36,
        height: 36,
        borderColor: 'rgba(127, 166, 83, 0.3)',
        duration: 0.4,
        ease: 'power3.out',
      })
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3 })
      gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.2 })

      trails.forEach((trail, i) => {
        gsap.to(trail, { opacity: 0.3 - i * 0.08, duration: 0.3 })
      })
    }

    // MutationObserver to watch for dynamically added interactive elements
    const bindInteractives = () => {
      const els = document.querySelectorAll('a, button, [data-cursor-hover]')
      els.forEach((el) => {
        el.removeEventListener('mouseenter', handleEnterInteractive)
        el.removeEventListener('mouseleave', handleLeaveInteractive)
        el.addEventListener('mouseenter', handleEnterInteractive)
        el.addEventListener('mouseleave', handleLeaveInteractive)
      })
    }

    let debounceTimer: ReturnType<typeof setTimeout>
    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(bindInteractives, 300)
    })
    observer.observe(document.body, { childList: true, subtree: true })
    bindInteractives()

    window.addEventListener('mousemove', onMove)
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      observer.disconnect()
      document.head.removeChild(style)
      const els = document.querySelectorAll('a, button, [data-cursor-hover]')
      els.forEach((el) => {
        el.removeEventListener('mouseenter', handleEnterInteractive)
        el.removeEventListener('mouseleave', handleLeaveInteractive)
      })
    }
  }, [])

  return (
    <div className="hidden md:block">
      {/* Trail particles */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el }}
          className="fixed top-0 left-0 pointer-events-none z-[997] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 4 - i,
            height: 4 - i,
            backgroundColor: `rgba(127, 166, 83, ${0.3 - i * 0.08})`,
          }}
        />
      ))}

      {/* Dot — precise position */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[999] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-primary mix-blend-difference" />
      </div>

      {/* Ring — trailing */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[998] -translate-x-1/2 -translate-y-1/2 rounded-full border mix-blend-difference transition-[width,height] duration-200"
        style={{
          width: 36,
          height: 36,
          borderColor: 'rgba(127, 166, 83, 0.3)',
          borderWidth: 1,
        }}
      />

      {/* Hover label */}
      <div
        ref={labelRef}
        className="fixed top-0 left-0 pointer-events-none z-[1000] -translate-x-1/2 -translate-y-1/2 opacity-0 scale-[0.8]"
      >
        {hoverLabel && (
          <span className="font-body text-[9px] tracking-[0.25em] uppercase text-primary-light whitespace-nowrap">
            {hoverLabel}
          </span>
        )}
      </div>
    </div>
  )
}
