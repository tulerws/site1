import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TiltCard from '../ui/TiltCard'
import type { Lang } from '../../i18n/translations'
import { t } from '../../i18n/translations'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import ProjectAnimation from '../three/ProjectAnimations'

gsap.registerPlugin(ScrollTrigger)

interface WorkProps {
  lang: Lang
}

const cardAccents = [
  { gradient: 'from-primary/8 to-accent-warm/6', glare: 'rgba(127, 166, 83, 0.08)', hue: 100 },
  { gradient: 'from-accent-warm/8 to-accent-stone/6', glare: 'rgba(196, 163, 90, 0.08)', hue: 40 },
  { gradient: 'from-accent-sage/8 to-primary-dark/6', glare: 'rgba(138, 154, 108, 0.08)', hue: 80 },
  { gradient: 'from-primary-light/6 to-accent-sand/5', glare: 'rgba(153, 205, 133, 0.08)', hue: 120 },
]


function ProjectCard({
  project,
  index,
  viewText,
}: {
  project: { title: string; category: string; description: string; year: string }
  index: number
  viewText: string
}) {
  const [isHovered, setIsHovered] = useState(false)
  const accent = cardAccents[index % cardAccents.length]

  return (
    <div
      className="w-[75vw] md:w-[45vw] lg:w-[35vw] flex-shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TiltCard glareColor={accent.glare} tiltIntensity={1.2}>
        {/* Project image placeholder */}
        <div
          className={`aspect-[4/3] bg-gradient-to-br ${accent.gradient} flex items-center justify-center relative overflow-hidden`}
        >
          <div className="absolute inset-0 dot-pattern opacity-30" />
          <div className="absolute inset-0">
            <Canvas dpr={[1, 1.5]} gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}>
              <Suspense fallback={null}>
                <ProjectAnimation projectIndex={index} isHovered={isHovered} />
              </Suspense>
            </Canvas>
          </div>
          <span className="absolute bottom-4 right-4 font-display text-[60px] font-bold text-white/[0.02] select-none leading-none">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div
            className={`absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent flex items-end p-6 transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="font-body text-sm tracking-widest uppercase text-primary-light flex items-center gap-2">
              {viewText}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-body text-xs tracking-widest uppercase text-accent-stone/60">
              {project.category}
            </span>
            <span className="font-body text-xs text-white/20">{project.year}</span>
          </div>
          <h3 className="font-display text-2xl font-bold text-white/90 group-hover:text-gradient transition-all duration-300">
            {project.title}
          </h3>
          <p className="mt-2 font-body text-sm text-white/40 leading-relaxed">
            {project.description}
          </p>
        </div>
      </TiltCard>
    </div>
  )
}

export default function Work({ lang }: WorkProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const projects = t('work.projects', lang) as Array<{
    title: string
    category: string
    description: string
    year: string
  }>

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    // Calculate how far to scroll horizontally
    const totalWidth = track.scrollWidth - window.innerWidth

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${totalWidth}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => {
        gsap.set(track, { x: -self.progress * totalWidth })
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${self.progress})`
        }
      },
    })

    // Stagger cards entrance
    const cards = track.querySelectorAll('.work-card')
    gsap.fromTo(
      cards,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    return () => {
      st.kill()
      ScrollTrigger.getAll().forEach((s) => {
        if (s.trigger === section) s.kill()
      })
    }
  }, [])

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative overflow-hidden z-[2]"
      style={{ height: '100vh' }}
    >
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-warm/3 rounded-full blur-[200px]" />

      {/* Fixed header */}
      <div ref={headerRef} className="absolute top-0 left-0 right-0 z-10 pt-32 px-6 md:px-16 pb-6">
        <div className="flex items-end justify-between max-w-[95vw] mx-auto">
          <div>
            <p className="font-body text-xs tracking-[0.4em] uppercase text-primary/50 mb-4">
              {t('work.tag', lang)}
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white/90 scramble-title">
              {t('work.title', lang)}
            </h2>
          </div>
          {/* Progress indicator */}
          <div className="hidden md:flex items-center gap-4 mb-2">
            <span className="font-body text-xs tracking-widest uppercase text-white/30">
              {t('work.viewProject', lang)}
            </span>
            <div className="w-32 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div
                ref={progressRef}
                className="h-full bg-primary/60 origin-left"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal scrolling track */}
      <div
        ref={trackRef}
        className="flex items-center gap-8 px-6 md:px-16 absolute top-0 left-0 h-full"
        style={{ paddingTop: '10rem' }}
      >
        {/* Spacer for header */}
        <div className="flex-shrink-0 w-[5vw]" />

        {projects.map((project, i) => (
          <div key={project.title} className="work-card opacity-0">
            <ProjectCard
              project={project}
              index={i}
              viewText={t('work.viewProject', lang)}
            />
          </div>
        ))}

        {/* End spacer */}
        <div className="flex-shrink-0 w-[10vw]" />
      </div>
    </section>
  )
}
