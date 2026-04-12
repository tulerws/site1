import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Lang } from '../../i18n/translations'
import { t } from '../../i18n/translations'

gsap.registerPlugin(ScrollTrigger)

interface ServicesProps {
  lang: Lang
}

// Service-specific accent colors for the expanded panel
const serviceThemes = [
  { accent: '#7FA653', accentRgb: '127, 166, 83', label: 'Dn' },
  { accent: '#C4A35A', accentRgb: '196, 163, 90', label: 'Dv' },
  { accent: '#8A9A6C', accentRgb: '138, 154, 108', label: 'Ex' },
  { accent: '#B8934A', accentRgb: '184, 147, 74', label: 'St' },
]

function ServicePanel({
  service,
  index,
  isActive,
  onActivate,
  total,
}: {
  service: { title: string; description: string; icon: string }
  index: number
  isActive: boolean
  onActivate: () => void
  total: number
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const theme = serviceThemes[index % serviceThemes.length]

  // Animate content in/out
  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    if (isActive) {
      gsap.to(content, { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: 'power3.out' })
    } else {
      gsap.to(content, { opacity: 0, y: 20, duration: 0.3, ease: 'power2.in' })
    }
  }, [isActive])

  // Scroll-triggered entrance
  useEffect(() => {
    const el = panelRef.current
    if (!el) return

    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        delay: index * 0.08,
      }
    )
  }, [index])

  return (
    <div
      ref={panelRef}
      onClick={onActivate}
      onMouseEnter={onActivate}
      className="opacity-0 group relative cursor-pointer"
      style={{
        flex: isActive ? 4 : 1,
        transition: 'flex 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        minHeight: '420px',
      }}
    >
      {/* Background layer */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          background: isActive
            ? `linear-gradient(160deg, rgba(${theme.accentRgb}, 0.06) 0%, rgba(${theme.accentRgb}, 0.02) 40%, rgba(8, 12, 8, 0.95) 100%)`
            : 'rgba(255, 255, 255, 0.01)',
          border: `1px solid rgba(${theme.accentRgb}, ${isActive ? 0.15 : 0.05})`,
          transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {/* Dot grid accent */}
        <div
          className="absolute inset-0 dot-pattern"
          style={{
            opacity: isActive ? 0.4 : 0.1,
            transition: 'opacity 0.6s ease',
          }}
        />
      </div>

      {/* Vertical orientation line */}
      <div
        ref={lineRef}
        className="absolute top-0 left-0 w-[1px]"
        style={{
          height: isActive ? '100%' : '0%',
          background: `linear-gradient(to bottom, transparent, rgba(${theme.accentRgb}, 0.4), transparent)`,
          transition: 'height 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      />

      {/* === COLLAPSED STATE — Vertical label === */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-between py-10"
        style={{
          opacity: isActive ? 0 : 1,
          pointerEvents: isActive ? 'none' : 'auto',
          transition: 'opacity 0.4s ease',
        }}
      >
        {/* Index number */}
        <span
          className="font-display text-xs tracking-[0.3em] uppercase"
          style={{ color: `rgba(${theme.accentRgb}, 0.5)` }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Vertical title */}
        <div
          className="flex-1 flex items-center justify-center"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <h3
            className="font-display text-lg tracking-[0.15em] uppercase whitespace-nowrap"
            style={{
              color: 'rgba(255, 255, 255, 0.55)',
              transform: 'rotate(180deg)',
              transition: 'color 0.3s ease',
            }}
          >
            {service.title}
          </h3>
        </div>

        {/* Bottom dash */}
        <div
          className="w-4 h-[1px]"
          style={{ background: `rgba(${theme.accentRgb}, 0.25)` }}
        />
      </div>

      {/* === EXPANDED STATE — Full content === */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col justify-end p-10 md:p-12"
        style={{
          opacity: 0,
          transform: 'translateY(20px)',
          pointerEvents: isActive ? 'auto' : 'none',
        }}
      >
        {/* Top: number + tag */}
        <div className="absolute top-10 left-10 md:left-12 flex items-baseline gap-4">
          <span
            className="font-display text-6xl md:text-7xl font-bold"
            style={{ color: `rgba(${theme.accentRgb}, 0.08)` }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Decorative element — dynamic based on service */}
        <div className="absolute top-1/4 right-10 md:right-12">
          <ServiceVisual index={index} isActive={isActive} accentRgb={theme.accentRgb} />
        </div>

        {/* Title */}
        <h3
          className="font-display text-4xl md:text-5xl font-bold mb-4"
          style={{ color: 'rgba(255, 255, 255, 0.9)' }}
        >
          {service.title}
        </h3>

        {/* Description */}
        <p
          className="font-body text-base md:text-lg leading-relaxed max-w-md mb-8"
          style={{ color: 'rgba(255, 255, 255, 0.45)' }}
        >
          {service.description}
        </p>

        {/* Bottom bar — progress indicator */}
        <div className="flex items-center gap-6">
          <div className="flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className="h-[2px] rounded-full transition-all duration-500"
                style={{
                  width: i === index ? '32px' : '8px',
                  background:
                    i === index
                      ? `rgba(${theme.accentRgb}, 0.6)`
                      : 'rgba(255, 255, 255, 0.1)',
                }}
              />
            ))}
          </div>
          <span
            className="font-body text-[11px] tracking-[0.3em] uppercase"
            style={{ color: `rgba(${theme.accentRgb}, 0.4)` }}
          >
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  )
}

// Abstract visual element unique to each service
function ServiceVisual({
  index,
  isActive,
  accentRgb,
}: {
  index: number
  isActive: boolean
  accentRgb: string
}) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !isActive) return
    const paths = svgRef.current.querySelectorAll('path, line, circle, rect')
    gsap.fromTo(
      paths,
      { strokeDashoffset: 200, opacity: 0 },
      {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.08,
      }
    )
  }, [isActive])

  const strokeColor = `rgba(${accentRgb}, 0.25)`
  const size = 120

  // Each service gets a unique generative SVG mark
  const visuals = [
    // Design — layered diamonds
    <svg key="design" ref={svgRef} width={size} height={size} viewBox="0 0 120 120" fill="none">
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={30 + i * 5}
          y={30 + i * 5}
          width={60 - i * 10}
          height={60 - i * 10}
          stroke={strokeColor}
          strokeWidth={0.5}
          strokeDasharray="200"
          strokeDashoffset="200"
          opacity={0}
          transform={`rotate(${45 + i * 8}, 60, 60)`}
        />
      ))}
      <circle cx={60} cy={60} r={3} stroke={strokeColor} strokeWidth={0.5} strokeDasharray="200" strokeDashoffset="200" opacity={0} />
      <line x1={60} y1={20} x2={60} y2={100} stroke={strokeColor} strokeWidth={0.3} strokeDasharray="200" strokeDashoffset="200" opacity={0} />
      <line x1={20} y1={60} x2={100} y2={60} stroke={strokeColor} strokeWidth={0.3} strokeDasharray="200" strokeDashoffset="200" opacity={0} />
    </svg>,
    // Development — circuit/code brackets
    <svg key="dev" ref={svgRef} width={size} height={size} viewBox="0 0 120 120" fill="none">
      <path d="M45 30 L25 60 L45 90" stroke={strokeColor} strokeWidth={0.8} strokeDasharray="200" strokeDashoffset="200" opacity={0} />
      <path d="M75 30 L95 60 L75 90" stroke={strokeColor} strokeWidth={0.8} strokeDasharray="200" strokeDashoffset="200" opacity={0} />
      <line x1={55} y1={25} x2={65} y2={95} stroke={strokeColor} strokeWidth={0.5} strokeDasharray="200" strokeDashoffset="200" opacity={0} />
      {[40, 55, 70, 85].map((y) => (
        <circle key={y} cx={60} cy={y} r={1.5} stroke={strokeColor} strokeWidth={0.5} strokeDasharray="200" strokeDashoffset="200" opacity={0} />
      ))}
      <rect x={35} y={45} width={50} height={30} stroke={strokeColor} strokeWidth={0.3} strokeDasharray="200" strokeDashoffset="200" opacity={0} rx={2} />
    </svg>,
    // Experience — 3D cube / immersive
    <svg key="experience" ref={svgRef} width={size} height={size} viewBox="0 0 120 120" fill="none">
      <path d="M60 20 L95 40 L95 80 L60 100 L25 80 L25 40 Z" stroke={strokeColor} strokeWidth={0.6} strokeDasharray="200" strokeDashoffset="200" opacity={0} />
      <path d="M60 20 L60 100" stroke={strokeColor} strokeWidth={0.3} strokeDasharray="200" strokeDashoffset="200" opacity={0} />
      <path d="M25 40 L95 40" stroke={strokeColor} strokeWidth={0.3} strokeDasharray="200" strokeDashoffset="200" opacity={0} />
      <path d="M25 80 L95 80" stroke={strokeColor} strokeWidth={0.3} strokeDasharray="200" strokeDashoffset="200" opacity={0} />
      <circle cx={60} cy={60} r={15} stroke={strokeColor} strokeWidth={0.4} strokeDasharray="200" strokeDashoffset="200" opacity={0} />
      <circle cx={60} cy={60} r={6} stroke={strokeColor} strokeWidth={0.4} strokeDasharray="200" strokeDashoffset="200" opacity={0} />
    </svg>,
    // Strategy — constellation / data points
    <svg key="strategy" ref={svgRef} width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Connecting lines */}
      <path d="M30 80 L50 45 L75 55 L90 30" stroke={strokeColor} strokeWidth={0.5} strokeDasharray="200" strokeDashoffset="200" opacity={0} />
      <path d="M50 45 L60 75 L75 55" stroke={strokeColor} strokeWidth={0.4} strokeDasharray="200" strokeDashoffset="200" opacity={0} />
      <path d="M60 75 L85 85" stroke={strokeColor} strokeWidth={0.4} strokeDasharray="200" strokeDashoffset="200" opacity={0} />
      {/* Nodes */}
      {[
        [30, 80], [50, 45], [75, 55], [90, 30], [60, 75], [85, 85],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={3} stroke={strokeColor} strokeWidth={0.6} strokeDasharray="200" strokeDashoffset="200" opacity={0} />
      ))}
      {/* Grid lines */}
      <line x1={20} y1={90} x2={100} y2={90} stroke={strokeColor} strokeWidth={0.2} strokeDasharray="200" strokeDashoffset="200" opacity={0} />
      <line x1={20} y1={60} x2={100} y2={60} stroke={strokeColor} strokeWidth={0.15} strokeDasharray="200" strokeDashoffset="200" opacity={0} />
    </svg>,
  ]

  return (
    <div
      style={{
        opacity: isActive ? 1 : 0,
        transform: isActive ? 'scale(1)' : 'scale(0.8)',
        transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      {visuals[index % visuals.length]}
    </div>
  )
}

// Mobile: stacked accordion
function MobileServiceItem({
  service,
  index,
  isActive,
  onToggle,
  total,
}: {
  service: { title: string; description: string; icon: string }
  index: number
  isActive: boolean
  onToggle: () => void
  total: number
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const itemRef = useRef<HTMLDivElement>(null)
  const theme = serviceThemes[index % serviceThemes.length]

  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    if (isActive) {
      gsap.to(content, { height: 'auto', opacity: 1, duration: 0.5, ease: 'power3.out' })
    } else {
      gsap.to(content, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.in' })
    }
  }, [isActive])

  useEffect(() => {
    const el = itemRef.current
    if (!el) return

    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        delay: index * 0.08,
      }
    )
  }, [index])

  return (
    <div
      ref={itemRef}
      className="opacity-0"
      style={{
        borderBottom: `1px solid rgba(${theme.accentRgb}, ${isActive ? 0.15 : 0.06})`,
        transition: 'border-color 0.4s ease',
      }}
    >
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 px-2 text-left"
      >
        <div className="flex items-baseline gap-5">
          <span
            className="font-display text-xs tracking-[0.3em]"
            style={{ color: `rgba(${theme.accentRgb}, 0.4)` }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3
            className="font-display text-2xl font-bold"
            style={{
              color: isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)',
              transition: 'color 0.3s ease',
            }}
          >
            {service.title}
          </h3>
        </div>
        <div
          className="w-5 h-5 flex items-center justify-center"
          style={{
            transform: isActive ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <line x1="7" y1="0" x2="7" y2="14" stroke={`rgba(${theme.accentRgb}, 0.5)`} strokeWidth="1" />
            <line x1="0" y1="7" x2="14" y2="7" stroke={`rgba(${theme.accentRgb}, 0.5)`} strokeWidth="1" />
          </svg>
        </div>
      </button>

      {/* Expandable content */}
      <div ref={contentRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <div className="pb-8 px-2 pl-12">
          <p className="font-body text-base leading-relaxed max-w-lg" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            {service.description}
          </p>
          <div className="mt-6 flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className="h-[2px] rounded-full"
                style={{
                  width: i === index ? '24px' : '6px',
                  background:
                    i === index
                      ? `rgba(${theme.accentRgb}, 0.5)`
                      : 'rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.4s ease',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Services({ lang }: ServicesProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  const services = t('services.items', lang) as Array<{
    title: string
    description: string
    icon: string
  }>

  const handleActivate = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  return (
    <section id="services" ref={sectionRef} className="relative py-32 md:py-44 px-6">
      <div
        data-speed="0.3"
        className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full blur-[200px] pointer-events-none"
        style={{ background: `rgba(${serviceThemes[activeIndex].accentRgb}, 0.03)`, transition: 'background 0.8s ease' }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header — left-aligned */}
        <div className="mb-20 md:mb-24 max-w-2xl">
          <p className="font-body text-xs tracking-[0.4em] uppercase text-accent-warm/50 mb-5">
            {t('services.tag', lang)}
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white/90 scramble-title">
            {t('services.title', lang)}
          </h2>
        </div>

        {/* Desktop: Horizontal accordion */}
        <div className="hidden md:flex gap-[2px]" style={{ height: '460px' }}>
          {services.map((service, i) => (
            <ServicePanel
              key={service.title}
              service={service}
              index={i}
              isActive={activeIndex === i}
              onActivate={() => handleActivate(i)}
              total={services.length}
            />
          ))}
        </div>

        {/* Mobile: Stacked accordion */}
        <div
          className="md:hidden"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
        >
          {services.map((service, i) => (
            <MobileServiceItem
              key={service.title}
              service={service}
              index={i}
              isActive={activeIndex === i}
              onToggle={() => handleActivate(activeIndex === i ? -1 : i)}
              total={services.length}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
