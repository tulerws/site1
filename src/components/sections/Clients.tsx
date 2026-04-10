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
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const testimonials = t('clients.testimonials', lang) as Array<{
    quote: string
    author: string
    role: string
    company: string
  }>

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Animate logos
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

    // Animate testimonial
    const testimonialEl = section.querySelector('.testimonial-block')
    if (testimonialEl) {
      gsap.fromTo(
        testimonialEl,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: testimonialEl,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section || section.contains(st.trigger as Node)) st.kill()
      })
    }
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials])

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-40 px-6 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent-sage/3 rounded-full blur-[200px]" />

      <div className="max-w-6xl mx-auto">
        {/* Tag */}
        <p className="font-body text-xs tracking-[0.4em] uppercase text-primary/40 mb-16 text-center">
          {t('clients.tag', lang)}
        </p>

        {/* Client logos row */}
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 mb-24">
          {clientLogos.map((name, i) => (
            <div
              key={name}
              className="client-logo group cursor-default"
            >
              <span className="font-display text-xl md:text-2xl font-bold text-white/[0.08] group-hover:text-white/30 transition-all duration-500 tracking-widest">
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        {testimonials && testimonials.length > 0 && (
          <div className="testimonial-block max-w-3xl mx-auto text-center">
            {/* Quote mark */}
            <div className="text-primary/20 text-6xl font-display mb-6 leading-none">"</div>

            {/* Quote */}
            <div className="relative min-h-[120px]">
              {testimonials.map((testimonial, i) => (
                <p
                  key={i}
                  className={`font-body text-lg md:text-xl text-white/60 leading-relaxed italic absolute inset-0 transition-all duration-700 ${
                    i === activeTestimonial
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  {testimonial.quote}
                </p>
              ))}
            </div>

            {/* Author */}
            <div className="mt-10">
              <p className="font-display text-sm font-semibold text-white/80">
                {testimonials[activeTestimonial]?.author}
              </p>
              <p className="font-body text-xs text-white/30 mt-1">
                {testimonials[activeTestimonial]?.role} — {testimonials[activeTestimonial]?.company}
              </p>
            </div>

            {/* Dots */}
            {testimonials.length > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === activeTestimonial
                        ? 'bg-primary/60 w-6'
                        : 'bg-white/15 hover:bg-white/25'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
