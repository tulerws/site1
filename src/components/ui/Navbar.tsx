import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import type { Lang } from '../../i18n/translations'
import { t } from '../../i18n/translations'

gsap.registerPlugin(ScrollToPlugin)

interface NavbarProps {
  lang: Lang
}

const smoothScrollTo = (href: string) => {
  const target = document.querySelector(href)
  if (target) {
    const y = target.getBoundingClientRect().top + window.scrollY
    gsap.to(window, {
      scrollTo: { y, autoKill: false },
      duration: 1.4,
      ease: 'power3.inOut',
    })
  }
}

export default function Navbar({ lang }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLSpanElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const logoAnimating = useRef(false)

  const links = [
      { label: t('nav.about', lang), href: '#about' },
    { label: t('nav.work', lang), href: '#work' },
    { label: t('nav.services', lang), href: '#services' },
    { label: t('nav.contact', lang), href: '#contact' },
  ]

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    gsap.fromTo(
      nav,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 6.8 }
    )

    let lastScroll = 0
    const handleScroll = () => {
      const currentScroll = window.scrollY
      if (currentScroll > lastScroll && currentScroll > 100) {
        gsap.to(nav, { y: -100, duration: 0.4, ease: 'power2.inOut' })
      } else {
        gsap.to(nav, { y: 0, duration: 0.4, ease: 'power2.inOut' })
      }
      lastScroll = currentScroll
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleLangHref = lang === 'pt' ? '/en/' : '/'

  const flag = lang === 'pt'
    ? '🇺🇸'  // Show flag of the language to switch TO
    : '🇧🇷'

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex items-center justify-between opacity-0"
      >
        {/* Logo */}
        <a
          href={lang === 'pt' ? '/' : `/${lang}/`}
          className="font-logo text-2xl font-bold tracking-tight"
          data-cursor-hover
          data-nav-logo
          onClick={(e) => {
            e.preventDefault()
            if (logoAnimating.current) return
            logoAnimating.current = true
            // Animate the floating NOVA from preloader (the actual visible logo)
            const floatLogo = document.querySelector('[data-nav-logo-float]') as HTMLElement
            const target = floatLogo || logoRef.current
            if (!target) { logoAnimating.current = false; return }
            const tl = gsap.timeline({
              onComplete: () => { logoAnimating.current = false },
            })
            tl.to(target, {
              letterSpacing: '10vw',
              duration: 0.6,
              ease: 'power2.out',
            })
            tl.to(target, {
              letterSpacing: '0.025em',
              duration: 0.7,
              ease: 'power3.inOut',
            })
          }}
        >
          <span ref={logoRef} className="text-gradient inline-block">NOVA</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                smoothScrollTo(link.href)
              }}
              className="nav-link font-body text-[13px] tracking-[0.15em] uppercase text-white/50 hover:text-primary-light transition-colors duration-300"
              data-cursor-hover
            >
              {link.label}
            </a>
          ))}
          <a
            href={toggleLangHref}
            className="ml-2 inline-flex items-center gap-2 font-body text-[11px] tracking-widest uppercase text-primary/60 hover:text-primary border border-primary/15 hover:border-primary/40 px-3 py-1.5 rounded-full transition-all duration-300"
            data-cursor-hover
          >
            <span className="text-base leading-none">{flag}</span>
            {t('nav.lang', lang)}
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden flex flex-col gap-1.5 z-50"
          onClick={() => setIsOpen(!isOpen)}
          data-cursor-hover
        >
          <span
            className={`block w-6 h-[1px] bg-white transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`}
          />
          <span
            className={`block w-6 h-[1px] bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block w-6 h-[1px] bg-white transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="font-display text-3xl font-bold tracking-wider text-white/80 hover:text-primary-light transition-colors"
            onClick={(e) => {
              e.preventDefault()
              setIsOpen(false)
              setTimeout(() => smoothScrollTo(link.href), 400)
            }}
          >
            {link.label}
          </a>
        ))}
        <a
          href={toggleLangHref}
          className="mt-4 inline-flex items-center gap-2 font-body text-sm tracking-widest uppercase text-primary border border-primary/30 px-6 py-2 rounded-full"
        >
          <span className="text-lg leading-none">{flag}</span>
          {t('nav.lang', lang)}
        </a>
      </div>
    </>
  )
}
