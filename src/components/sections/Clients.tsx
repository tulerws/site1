import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Lang } from '../../i18n/translations'
import { t } from '../../i18n/translations'

gsap.registerPlugin(ScrollTrigger)

interface ClientsProps {
  lang: Lang
}

const clientLogos = ['AURORA', 'NEXUS', 'VERTEX', 'CIPHER', 'ORBIT', 'PRISM']

export default function Clients({ lang }: ClientsProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const quoteRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const testimonials = t('clients.testimonials', lang) as Array<{
    quote: string
    author: string
    role: string
    company: string
  }>

  // Auto-cycle testimonials
  useEffect(() => {
    if (!testimonials || testimonials.length === 0) return

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [testimonials?.length])

  // Animate transition between testimonials
  useEffect(() => {
    const el = quoteRef.current
    if (!el) return

    gsap.fromTo(
      el,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
  }, [activeIndex])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Animate logos entrance
    const logos = section.querySelectorAll('.client-logo')
    gsap.fromTo(
      logos,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section || section.contains(st.trigger as Node)) st.kill()
      })
    }
  }, [])

  const handleDotClick = (index: number) => {
    setActiveIndex(index)
    // Reset interval on manual click
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)
  }

  const active = testimonials?.[activeIndex]

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-40 px-6 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent-sage/3 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full">
        {/* Tag & Logos */}
        <p className="font-body text-xs tracking-[0.4em] uppercase text-primary/40 mb-12 text-center md:text-left">
          {t('clients.tag', lang)}
        </p>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 md:gap-16 mb-20">
          {clientLogos.map((name) => (
            <div key={name} className="client-logo group cursor-default">
              <span className="font-display text-xl md:text-2xl font-bold text-white/[0.08] group-hover:text-white/40 transition-all duration-500 tracking-widest">
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* Testimonial — single active with fade transition */}
        {active && (
          <div className="max-w-3xl mx-auto md:mx-0">
            <div ref={quoteRef} className="relative">
              <div className="text-primary/10 text-8xl font-display absolute -top-8 -left-6 leading-none select-none pointer-events-none">
                &ldquo;
              </div>
              <p className="font-body text-2xl md:text-3xl text-white/80 leading-relaxed italic relative z-10">
                {active.quote}
              </p>
              <div className="mt-8 border-t border-white/10 pt-6 flex items-end justify-between">
                <div>
                  <p className="font-display text-lg font-semibold text-white/90">
                    {active.author}
                  </p>
                  <p className="font-body text-sm text-primary/60 mt-1 uppercase tracking-wider">
                    {active.role} — {active.company}
                  </p>
                </div>

                {/* Navigation dots */}
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleDotClick(i)}
                      className="w-2 h-2 rounded-full transition-all duration-400"
                      style={{
                        background:
                          i === activeIndex
                            ? 'rgba(127, 166, 83, 0.6)'
                            : 'rgba(255, 255, 255, 0.1)',
                        transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
