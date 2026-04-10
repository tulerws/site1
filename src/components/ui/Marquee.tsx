import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface MarqueeProps {
  items?: string[]
  speed?: number
  reverse?: boolean
  className?: string
  separator?: string
}

export default function Marquee({
  items = ['DESIGN', 'TECHNOLOGY', 'EXPERIENCE', 'INNOVATION', 'STRATEGY', 'FUTURE'],
  speed = 40,
  reverse = false,
  className = '',
  separator = '✦',
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const firstSet = track.querySelector('.marquee-set') as HTMLElement
    if (!firstSet) return

    const w = firstSet.offsetWidth

    // Seamless infinite scroll
    gsap.set(track, { x: reverse ? -w : 0 })
    const tween = gsap.to(track, {
      x: reverse ? 0 : -w,
      duration: speed,
      ease: 'none',
      repeat: -1,
    })

    // Speed up on scroll
    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const vel = Math.abs(self.getVelocity() / 300)
        gsap.to(tween, { timeScale: 1 + vel, duration: 0.3, overwrite: true })
      },
    })

    return () => {
      tween.kill()
      st.kill()
    }
  }, [speed, reverse])

  const text = items.map((item) => `${item} ${separator} `).join('')

  return (
    <div className={`overflow-hidden whitespace-nowrap py-6 ${className}`}>
      <div ref={trackRef} className="inline-flex">
        <div className="marquee-set inline-block">
          <span className="font-display text-[clamp(1.2rem,3vw,2.5rem)] font-bold tracking-widest text-white/[0.06] uppercase select-none">
            {text}
          </span>
        </div>
        <div className="marquee-set inline-block">
          <span className="font-display text-[clamp(1.2rem,3vw,2.5rem)] font-bold tracking-widest text-white/[0.06] uppercase select-none">
            {text}
          </span>
        </div>
        <div className="marquee-set inline-block">
          <span className="font-display text-[clamp(1.2rem,3vw,2.5rem)] font-bold tracking-widest text-white/[0.06] uppercase select-none">
            {text}
          </span>
        </div>
      </div>
    </div>
  )
}
