import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas } from '@react-three/fiber'
import ManifestoObject from '../three/ManifestoObject'
import type { Lang } from '../../i18n/translations'
import { t } from '../../i18n/translations'

gsap.registerPlugin(ScrollTrigger)

interface ManifestoProps {
  lang: Lang
}

export default function Manifesto({ lang }: ManifestoProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const linesRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const lines = linesRef.current.filter(Boolean) as HTMLDivElement[]

    lines.forEach((line, i) => {
      gsap.fromTo(
        line,
        { opacity: 0.1, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: line,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          },
        }
      )

      // Glow effect on words
      const words = line.querySelectorAll('.word')
      words.forEach((word, wi) => {
        gsap.fromTo(
          word,
          { opacity: 0.3 },
          {
            opacity: 1,
            scrollTrigger: {
              trigger: word,
              start: 'top 75%',
              end: 'top 45%',
              scrub: 1,
            },
          }
        )
      })
    })

    return () => { ScrollTrigger.getAll().forEach((st) => st.kill()) }
  }, [])

  const manifestoLines = [
    t('manifesto.line1', lang),
    t('manifesto.line2', lang),
    t('manifesto.line3', lang),
    t('manifesto.line4', lang),
  ]

  return (
    <section
      ref={sectionRef}
      className="relative py-40 md:py-60 px-6 overflow-hidden"
    >
      {/* WebGL Background */}
      <div className="absolute inset-0 z-0 opacity-80">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ManifestoObject />
        </Canvas>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 pointer-events-none">
        {/* Tag */}
        <p className="font-body text-xs tracking-[0.4em] uppercase text-accent-warm/50 mb-16">
          {t('manifesto.tag', lang)}
        </p>

        {/* Lines */}
        <div className="space-y-4 md:space-y-6">
          {manifestoLines.map((line, i) => (
            <div
              key={i}
              ref={(el) => { linesRef.current[i] = el }}
              className="font-display text-2xl md:text-4xl lg:text-5xl font-medium leading-tight text-white/90"
            >
              {line.split(' ').map((word: string, wi: number) => (
                <span key={wi} className="word inline-block mr-[0.3em]">
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
