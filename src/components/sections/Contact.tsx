import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Lang } from '../../i18n/translations'
import { t } from '../../i18n/translations'

gsap.registerPlugin(ScrollTrigger)

interface ContactProps {
  lang: Lang
}

export default function Contact({ lang }: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    gsap.fromTo(
      formRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder — no backend
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-32 md:py-48 px-6"
    >
      {/* Bg glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[250px]" />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-accent-warm/3 rounded-full blur-[200px]" />

      <div className="max-w-4xl mx-auto text-center">
        {/* Tag */}
        <p className="font-body text-xs tracking-[0.4em] uppercase text-accent-sand/50 mb-6">
          {t('contact.tag', lang)}
        </p>

        {/* Title */}
        <h2
          ref={titleRef}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white/90 leading-tight mb-6 opacity-0 scramble-title"
        >
          {t('contact.title', lang)}
        </h2>

        <p className="font-body text-base md:text-lg text-white/40 mb-12">
          {t('contact.subtitle', lang)}
        </p>

        {/* Form */}
        <div ref={formRef} className="opacity-0">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-4 max-w-lg mx-auto"
          >
            <div className="relative flex-1 w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('contact.placeholder', lang)}
                className="w-full px-6 py-4 rounded-full glass-strong bg-transparent text-white font-body text-sm tracking-wide placeholder:text-white/20 outline-none focus:border-primary/40 transition-colors duration-300"
                required
              />
            </div>
            <button
              type="submit"
              className="magnetic-btn px-8 py-4 rounded-full bg-gradient-to-r from-primary/15 to-primary-dark/15 border border-primary/25 hover:border-primary/50 text-primary-light font-body text-sm tracking-widest uppercase whitespace-nowrap transition-all duration-300 hover:glow-primary"
              data-cursor-hover
            >
              {t('contact.cta', lang)}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
