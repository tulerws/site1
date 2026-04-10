import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface SectionRevealProps {
  children: React.ReactNode
  className?: string
  type?: 'circle' | 'inset' | 'diagonal'
}

export default function SectionReveal({
  children,
  className = '',
  type = 'inset',
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const getClipPaths = () => {
      switch (type) {
        case 'circle':
          return {
            from: 'circle(0% at 50% 50%)',
            to: 'circle(150% at 50% 50%)',
          }
        case 'diagonal':
          return {
            from: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
            to: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          }
        case 'inset':
        default:
          return {
            from: 'inset(15% 15% 15% 15%)',
            to: 'inset(0% 0% 0% 0%)',
          }
      }
    }

    const { from, to } = getClipPaths()

    gsap.fromTo(
      el,
      { clipPath: from },
      {
        clipPath: to,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill()
      })
    }
  }, [type])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
