import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TiltCard from '../ui/TiltCard'
import type { Lang } from '../../i18n/translations'
import { t } from '../../i18n/translations'

gsap.registerPlugin(ScrollTrigger)

interface ServicesProps {
  lang: Lang
}

const iconPaths: Record<string, string> = {
  design:
    'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  dev:
    'M16 18l6-6-6-6M8 6l-6 6 6 6',
  experience:
    'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
  strategy:
    'M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z',
}

const serviceAccents = [
  'rgba(127, 166, 83, 0.08)',
  'rgba(196, 163, 90, 0.08)',
  'rgba(138, 154, 108, 0.08)',
  'rgba(184, 147, 74, 0.08)',
]

const iconColors = [
  'text-primary',
  'text-accent-warm',
  'text-accent-sage',
  'text-accent-amber',
]

function ServiceCard({
  service,
  index,
}: {
  service: { title: string; description: string; icon: string }
  index: number
}) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    gsap.fromTo(
      el,
      { y: 60, opacity: 0 },
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
        delay: index * 0.1,
      }
    )
  }, [index])

  return (
    <div ref={wrapRef} className="opacity-0">
      <TiltCard
        glareColor={serviceAccents[index % serviceAccents.length]}
        tiltIntensity={10}
        className="p-8 md:p-10"
      >
        {/* Number */}
        <span className="font-display text-[80px] font-bold text-white/[0.02] absolute top-4 right-6 select-none">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl glass flex items-center justify-center mb-6">
          <svg
            className={`w-5 h-5 ${iconColors[index % iconColors.length]}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={iconPaths[service.icon] || iconPaths.design} />
          </svg>
        </div>

        {/* Content */}
        <h3 className="font-display text-xl md:text-2xl font-semibold text-white/90 mb-3">
          {service.title}
        </h3>
        <p className="font-body text-sm md:text-base text-white/40 leading-relaxed">
          {service.description}
        </p>

        {/* Bottom line */}
        <div className="mt-8 h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-primary/50 to-accent-warm/30 transition-all duration-700" />
      </TiltCard>
    </div>
  )
}

export default function Services({ lang }: ServicesProps) {
  const services = t('services.items', lang) as Array<{
    title: string
    description: string
    icon: string
  }>

  return (
    <section id="services" className="relative py-32 md:py-40 px-6">
      <div data-speed="0.3" className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-accent-sage/3 rounded-full blur-[200px]" />

      <div className="max-w-6xl mx-auto">
        <div className="mb-20 text-center">
          <p className="font-body text-xs tracking-[0.4em] uppercase text-accent-warm/50 mb-4">
            {t('services.tag', lang)}
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white/90 scramble-title">
            {t('services.title', lang)}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
