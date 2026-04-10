import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface PreloaderProps {
  onComplete: () => void
  enterText?: string
}

export default function Preloader({ onComplete, enterText = 'ENTRANDO NA SUPERNOVA' }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const prefixRef = useRef<HTMLSpanElement>(null)
  const novaRef = useRef<HTMLSpanElement>(null)
  const novaFloatRef = useRef<HTMLSpanElement>(null)
  const progressWrapRef = useRef<HTMLDivElement>(null)
  const textLineRef = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const prefix = prefixRef.current
    const nova = novaRef.current
    const novaFloat = novaFloatRef.current
    const counter = counterRef.current
    const progressWrap = progressWrapRef.current
    const textLine = textLineRef.current
    if (!container || !prefix || !nova || !novaFloat || !counter || !progressWrap || !textLine) return

    const countObj = { val: 0 }
    const tl = gsap.timeline()

    // Phase 1: Count 0 → 100
    tl.to(textLine, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    }, 0.3)

    tl.to(countObj, {
      val: 100,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => setCount(Math.round(countObj.val)),
    }, 0)

    // Phase 2: Highlight inline NOVA green
    tl.to(nova, {
      color: 'transparent',
      backgroundImage: 'linear-gradient(135deg, #99CD85 0%, #7FA653 50%, #CFE0BC 100%)',
      backgroundClip: 'text',
      webkitBackgroundClip: 'text',
      webkitTextFillColor: 'transparent',
      duration: 0.6,
      ease: 'power2.out',
    }, '+=0.3')

    // Fade out counter, progress bar, prefix text
    tl.to([counter, progressWrap], {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    }, '-=0.3')

    tl.to(prefix, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    }, '-=0.4')

    // Fade out decorations
    tl.to(container.querySelectorAll('.preloader-deco'), {
      opacity: 0,
      duration: 0.4,
    }, '-=0.3')

    // Phase 3: Swap inline NOVA → floating overlay at exact same position, then grow to center
    tl.call(() => {
      const rect = nova.getBoundingClientRect()
      const computedStyle = window.getComputedStyle(nova)

      // Position floating overlay exactly where inline NOVA is
      gsap.set(novaFloat, {
        top: rect.top,
        left: rect.left,
        fontSize: computedStyle.fontSize,
        letterSpacing: computedStyle.letterSpacing,
        opacity: 1,
      })

      // Pre-calculate where center will be at the large font size
      // Temporarily measure at target size
      const origFontSize = novaFloat.style.fontSize
      const origLetterSpacing = novaFloat.style.letterSpacing
      novaFloat.style.fontSize = `${Math.min(window.innerWidth * 0.15, 192)}px`
      novaFloat.style.letterSpacing = '0.05em'
      const bigRect = novaFloat.getBoundingClientRect()
      const centerTop = (window.innerHeight - bigRect.height) / 2
      const centerLeft = (window.innerWidth - bigRect.width) / 2
      // Restore original size
      novaFloat.style.fontSize = origFontSize
      novaFloat.style.letterSpacing = origLetterSpacing

      // Store targets on the element for the next tween
      novaFloat.dataset.centerTop = String(centerTop)
      novaFloat.dataset.centerLeft = String(centerLeft)

      // Hide inline version
      nova.style.visibility = 'hidden'
      textLine.style.visibility = 'hidden'
    })

    // Single tween: grow + move from inline position to center — straight path
    tl.to(novaFloat, {
      top: () => parseFloat(novaFloat.dataset.centerTop || '0'),
      left: () => parseFloat(novaFloat.dataset.centerLeft || '0'),
      fontSize: `${Math.min(window.innerWidth * 0.15, 192)}px`,
      letterSpacing: '0.05em',
      duration: 1.2,
      ease: 'power2.inOut',
    })

    // Hold
    tl.to(novaFloat, { duration: 0.6 })

    // Phase 4: Move NOVA out of preloader container so it survives the fade
    tl.call(() => {
      const rect = novaFloat.getBoundingClientRect()
      document.body.appendChild(novaFloat)
      gsap.set(novaFloat, { top: rect.top, left: rect.left })
    })

    // Fly to top-left logo position while shrinking
    tl.to(novaFloat, {
      top: 24,
      left: 48,
      fontSize: 24,
      letterSpacing: '0.025em',
      duration: 1.2,
      ease: 'power4.inOut',
    })

    // Fade out preloader background simultaneously
    tl.to(container, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=1.0')

    // Done — hide preloader, keep floating NOVA as the logo
    tl.call(() => {
      if (container) {
        container.style.pointerEvents = 'none'
        container.style.visibility = 'hidden'
      }
      // Hide only the navbar logo TEXT (not the <a> link itself, so it stays clickable)
      const navLogoSpan = document.querySelector('[data-nav-logo] span')
      if (navLogoSpan) (navLogoSpan as HTMLElement).style.visibility = 'hidden'
      onComplete()
    })

    return () => { tl.kill() }
  }, [onComplete])

  // Split enterText into prefix and "NOVA"
  const novaIndex = enterText.lastIndexOf('NOVA')
  const prefixText = novaIndex >= 0 ? enterText.slice(0, novaIndex) : enterText

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
    >
      {/* Grid overlay */}
      <div className="preloader-deco absolute inset-0 grid-pattern opacity-20" />

      {/* Corner accents */}
      <div className="preloader-deco absolute top-8 left-8 w-8 h-8 border-l border-t border-primary/20" />
      <div className="preloader-deco absolute top-8 right-8 w-8 h-8 border-r border-t border-primary/20" />
      <div className="preloader-deco absolute bottom-8 left-8 w-8 h-8 border-l border-b border-primary/20" />
      <div className="preloader-deco absolute bottom-8 right-8 w-8 h-8 border-r border-b border-primary/20" />

      {/* Counter */}
      <div className="relative">
        <span
          ref={counterRef}
          className="font-display text-[120px] md:text-[200px] font-bold leading-none tracking-tighter text-gradient"
        >
          {String(count).padStart(3, '0')}
        </span>
      </div>

      {/* Text: "ENTRANDO NA SUPER" + "NOVA" */}
      <div
        ref={textLineRef}
        className="mt-4 font-body text-sm tracking-[0.3em] uppercase text-white/40 opacity-0 flex items-center"
      >
        <span ref={prefixRef}>{prefixText}</span>
        <span
          ref={novaRef}
          className="font-logo font-bold text-white/40"
          style={{ display: 'inline-block' }}
        >
          NOVA
        </span>
      </div>

      {/* Floating NOVA overlay — becomes the persistent logo */}
      <span
        ref={novaFloatRef}
        className="fixed top-0 left-0 z-[200] font-logo font-bold pointer-events-none opacity-0 whitespace-nowrap"
        data-nav-logo-float
        style={{
          backgroundImage: 'linear-gradient(135deg, #99CD85 0%, #7FA653 50%, #CFE0BC 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        NOVA
      </span>

      {/* Progress bar */}
      <div ref={progressWrapRef} className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-white/10 overflow-hidden">
        <div
          className="h-full bg-primary/60 transition-none"
          style={{ width: `${count}%` }}
        />
      </div>
    </div>
  )
}
