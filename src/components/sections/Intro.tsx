import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Lang } from '../../i18n/translations'
import { t } from '../../i18n/translations'

gsap.registerPlugin(ScrollTrigger)

interface IntroProps {
  lang: Lang
}

function AnimatedStat({ number, label, delay }: { number: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.fromTo(el, { y: 30, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    })

    // Animate the number counter
    const numEl = el.querySelector('.stat-num')
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
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
      onUpdate: () => {
        numEl.textContent = Math.round(counter.val) + suffix
      },
    })
  }, [number, delay])

  return (
    <div ref={ref} className="text-center opacity-0">
      <div className="stat-num font-display text-3xl md:text-5xl font-bold text-gradient mb-1">{number}</div>
      <div className="font-body text-[11px] tracking-[0.3em] uppercase text-accent-stone/50">{label}</div>
    </div>
  )
}

export default function Intro({ lang }: IntroProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const text1Ref = useRef<HTMLParagraphElement>(null)
  const text2Ref = useRef<HTMLParagraphElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: headlineRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })

    tl.fromTo(headlineRef.current, { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1, ease: 'power3.out',
    })
    tl.fromTo(dividerRef.current, { scaleX: 0 }, {
      scaleX: 1, duration: 0.8, ease: 'power3.inOut',
    }, '-=0.4')
    tl.fromTo(text1Ref.current, { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
    }, '-=0.3')
    tl.fromTo(text2Ref.current, { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
    }, '-=0.5')

    return () => { ScrollTrigger.getAll().forEach((st) => st.kill()) }
  }, [])

  return (
    <section id="about" className="relative py-32 md:py-44 px-6 overflow-hidden">
      {/* Background glows */}
      <div data-speed="-0.3" className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[200px]" />
      <div data-speed="0.2" className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-warm/3 rounded-full blur-[180px]" />

      <div className="max-w-5xl mx-auto">
        {/* Tag */}
        <p className="font-body text-xs tracking-[0.4em] uppercase text-primary/40 mb-10">
          {t('intro.tag', lang)}
        </p>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-white/90 leading-tight max-w-4xl opacity-0 scramble-title"
        >
          {t('intro.headline', lang)}
        </h2>

        {/* Divider */}
        <div
          ref={dividerRef}
          className="mt-12 mb-12 h-[1px] bg-gradient-to-r from-primary/30 via-accent-warm/20 to-transparent origin-left"
          style={{ transform: 'scaleX(0)' }}
        />

        {/* Two-column text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-20">
          <p
            ref={text1Ref}
            className="font-body text-base md:text-lg text-white/45 leading-relaxed opacity-0"
          >
            {t('intro.text1', lang)}
          </p>
          <p
            ref={text2Ref}
            className="font-body text-base md:text-lg text-white/35 leading-relaxed opacity-0"
          >
            {t('intro.text2', lang)}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          {(t('about.stats', lang) as Array<{ number: string; label: string }>).map((stat, i) => (
            <AnimatedStat
              key={stat.label}
              number={stat.number}
              label={stat.label}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
