import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Lang } from '../../i18n/translations'
import { t } from '../../i18n/translations'

gsap.registerPlugin(ScrollTrigger)

interface AboutProps {
  lang: Lang
}

function AnimatedNumber({ number, label }: { number: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.fromTo(
      el,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // Animate the number if it's numeric
    const numEl = el.querySelector('.stat-number')
    if (!numEl) return
    const raw = number.replace(/[^0-9]/g, '')
    const suffix = number.replace(/[0-9]/g, '')
    const target = parseInt(raw) || 0

    const counter = { val: 0 }
    gsap.to(counter, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      onUpdate: () => {
        numEl.textContent = Math.round(counter.val) + suffix
      },
    })
  }, [number])

  return (
    <div ref={ref} className="text-center opacity-0">
      <div className="stat-number font-display text-4xl md:text-6xl font-bold text-gradient mb-2">
        {number}
      </div>
      <div className="font-body text-xs md:text-sm tracking-widest uppercase text-accent-stone/40">
        {label}
      </div>
    </div>
  )
}

export default function About({ lang }: AboutProps) {
  const titleRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)

  const stats = t('about.stats', lang) as Array<{ number: string; label: string }>

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
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
      descRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: descRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  return (
    <section id="about" className="relative py-32 md:py-40 px-6">
      {/* Bg accent */}
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-warm/3 rounded-full blur-[200px]" />

      <div className="max-w-5xl mx-auto">
        {/* Tag */}
        <p className="font-body text-xs tracking-[0.4em] uppercase text-accent-sand/50 mb-4">
          {t('about.tag', lang)}
        </p>

        {/* Title */}
        <div ref={titleRef} className="opacity-0">
          <h2 className="font-display text-4xl md:text-7xl font-bold text-white/90 mb-8">
            {t('about.title', lang)}
          </h2>
        </div>

        {/* Description */}
        <p
          ref={descRef}
          className="max-w-2xl font-body text-lg md:text-xl text-white/40 leading-relaxed mb-20 opacity-0"
        >
          {t('about.description', lang)}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <AnimatedNumber key={stat.label} number={stat.number} label={stat.label} />
          ))}
        </div>

        {/* Divider */}
        <div className="mt-20 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </section>
  )
}
