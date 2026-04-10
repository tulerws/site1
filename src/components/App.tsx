import { useState, useCallback } from 'react'
import SmoothScroll from './ui/SmoothScroll'
import CustomCursor from './ui/CustomCursor'
import Preloader from './ui/Preloader'
import NoiseOverlay from './ui/NoiseOverlay'
import ParticlesBackground from './ui/ParticlesBackground'
import Marquee from './ui/Marquee'
import SectionReveal from './ui/SectionReveal'
import Navbar from './ui/Navbar'
import Hero from './sections/Hero'
import Intro from './sections/Intro'
import Manifesto from './sections/Manifesto'
import Work from './sections/Work'
import Services from './sections/Services'
import Clients from './sections/Clients'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import { useTextScramble } from '../hooks/useTextScramble'
import { useMagneticButtons } from '../hooks/useMagneticButtons'
import { useParallaxLayers } from '../hooks/useParallaxLayers'
import type { Lang } from '../i18n/translations'
import { t } from '../i18n/translations'

interface AppProps {
  lang: Lang
}

export default function App({ lang }: AppProps) {
  const [loaded, setLoaded] = useState(false)

  const handlePreloaderComplete = useCallback(() => {
    setLoaded(true)
  }, [])

  // Global effects
  useTextScramble()
  useMagneticButtons()
  useParallaxLayers()

  return (
    <>
      <Preloader
        onComplete={handlePreloaderComplete}
        enterText={t('preloader.entering', lang)}
      />
      <CustomCursor />
      <NoiseOverlay />
      <ParticlesBackground />
      <SmoothScroll>
        <Navbar lang={lang} />
        <main>
          <Hero lang={lang} />
          <Marquee />
          <SectionReveal type="inset">
            <Intro lang={lang} />
          </SectionReveal>
          <Marquee
            items={['BRANDING', 'UI/UX', 'MOTION', 'WEB', '3D', 'CREATIVE']}
            reverse
            separator="—"
          />
          <Work lang={lang} />
          <SectionReveal type="diagonal">
            <Services lang={lang} />
          </SectionReveal>
          <Manifesto lang={lang} />
          <Clients lang={lang} />
          <Contact lang={lang} />
        </main>
        <Footer lang={lang} />
      </SmoothScroll>
    </>
  )
}
