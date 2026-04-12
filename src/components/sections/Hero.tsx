import { useEffect, useRef, Suspense, lazy } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import type { Lang } from '../../i18n/translations'
import { t } from '../../i18n/translations'

gsap.registerPlugin(ScrollToPlugin)

const HeroScene = lazy(() => import('../three/HeroScene'))

interface HeroProps {
  lang: Lang
}

/** Interactive text that starts as stroke-only outlines and fills in a radial area around the mouse */
function MagneticTitle({ children, className, innerRef }: {
  children: React.ReactNode
  className: string
  innerRef: React.RefObject<HTMLDivElement | null>
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const maskRef = useRef<HTMLDivElement>(null)
  const maskState = useRef({ x: 50, y: 50, active: false })

  useEffect(() => {
    const el = containerRef.current
    const maskEl = maskRef.current
    if (!el || !maskEl) return

    const pad = 80
    let rafId: number
    let cachedRect: DOMRect | null = null
    let rectTimer: ReturnType<typeof setTimeout>

    const updateRect = () => { cachedRect = el.getBoundingClientRect() }
    updateRect()

    const onMove = (e: MouseEvent) => {
      if (!cachedRect) return
      const rect = cachedRect
      if (
        e.clientX >= rect.left - pad &&
        e.clientX <= rect.right + pad &&
        e.clientY >= rect.top - pad &&
        e.clientY <= rect.bottom + pad
      ) {
        maskState.current.x = ((e.clientX - rect.left) / rect.width) * 100
        maskState.current.y = ((e.clientY - rect.top) / rect.height) * 100
        maskState.current.active = true
      } else {
        maskState.current.active = false
      }
      const r = maskState.current.active ? 8 : 0
      const grad = `radial-gradient(circle ${r}vw at ${maskState.current.x}% ${maskState.current.y}%, black 0%, transparent 100%)`
      maskEl.style.maskImage = grad
      maskEl.style.webkitMaskImage = grad
      maskEl.style.transition = maskState.current.active ? 'none' : 'mask-image 0.6s ease, -webkit-mask-image 0.6s ease'
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', updateRect, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', updateRect)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative overflow-hidden cursor-none">
      {/* Stroke-only base layer (always visible) */}
      <div className="overflow-hidden">
        <div
          ref={innerRef}
          className={`${className} opacity-0`}
          style={{
            WebkitTextStroke: '1.5px rgba(255,255,255,0.35)',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {children}
        </div>
      </div>

      {/* Filled reveal layer (masked by mouse position) */}
      <div
        ref={maskRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          maskImage: 'radial-gradient(circle 0vw at 50% 50%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle 0vw at 50% 50%, black 0%, transparent 100%)',
          willChange: 'mask-image',
        }}
      >
        <div
          className={className}
          style={{ opacity: 1 }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Hero({ lang }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const line1Ref = useRef<HTMLDivElement>(null)
  const line2Ref = useRef<HTMLDivElement>(null)
  const line3Ref = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 6.5 })

    // Title lines reveal
    const lines = [line1Ref.current, line2Ref.current, line3Ref.current]
    lines.forEach((line, i) => {
      if (!line) return
      tl.fromTo(
        line,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out',
        },
        i * 0.15
      )
    })

    // CTA
    tl.fromTo(
      ctaRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    )

    // Scroll indicator
    tl.fromTo(
      scrollIndicatorRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      '-=0.2'
    )

    return () => { tl.kill() }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background */}
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-bg/30 to-bg z-[1]" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg to-transparent z-[1]" />

      {/* Grid */}
      <div className="absolute inset-0 grid-pattern opacity-10 z-[1]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Title with interactive mouse reveal */}
        <h1 className="font-display font-bold leading-[0.9] tracking-tight">
          <MagneticTitle
            innerRef={line1Ref}
            className="text-[clamp(2.5rem,8vw,7rem)] text-white/90"
          >
            {t('hero.title.line1', lang)}
          </MagneticTitle>
          <MagneticTitle
            innerRef={line2Ref}
            className="text-[clamp(3rem,10vw,9rem)] text-gradient"
          >
            {t('hero.title.line2', lang)}
          </MagneticTitle>
          <MagneticTitle
            innerRef={line3Ref}
            className="text-[clamp(2.5rem,8vw,7rem)] text-white/90"
          >
            {t('hero.title.line3', lang)}
          </MagneticTitle>
        </h1>

        {/* CTA */}
        <div ref={ctaRef} className="mt-10 opacity-0">
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault()
              const target = document.querySelector('#work')
              if (target) {
                const y = target.getBoundingClientRect().top + window.scrollY
                gsap.to(window, {
                  scrollTo: { y, autoKill: false },
                  duration: 1.6,
                  ease: 'power3.inOut',
                })
              }
            }}
            className="magnetic-btn inline-flex items-center gap-3 px-8 py-4 rounded-full glass border border-primary/15 hover:border-primary/40 text-primary font-body text-sm tracking-widest uppercase transition-all duration-300 hover:glow-primary"
            data-cursor-hover
          >
            <span>{t('hero.cta', lang)}</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 opacity-0"
      >
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/30">
          {t('hero.scroll', lang)}
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
