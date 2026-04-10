import type { Lang } from '../../i18n/translations'
import { t } from '../../i18n/translations'

interface FooterProps {
  lang: Lang
}

const socialIcons: Record<string, JSX.Element> = {
  Twitter: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Instagram: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  Dribbble: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.424 25.424 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.245.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" />
    </svg>
  ),
  GitHub: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  ),
  LinkedIn: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  Behance: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.803 5.731c.589 0 1.119.051 1.605.155.483.103.895.273 1.243.508.343.235.611.547.804.939.187.387.28.871.28 1.443 0 .62-.14 1.138-.421 1.554-.283.417-.7.754-1.26 1.01.758.218 1.324.614 1.7 1.192.38.577.566 1.27.566 2.082 0 .62-.114 1.172-.349 1.655-.229.478-.557.88-.981 1.2-.418.323-.916.567-1.492.736-.575.164-1.197.249-1.867.249H0v-12.72h7.803zm-.351 4.972c.48 0 .878-.114 1.192-.349.312-.229.463-.607.463-1.119 0-.312-.06-.563-.185-.752a1.27 1.27 0 00-.472-.421 1.81 1.81 0 00-.645-.2 4.11 4.11 0 00-.693-.057H3.49v2.9h3.963zm.138 5.321c.263 0 .514-.03.756-.089.24-.06.455-.157.642-.293.187-.14.337-.321.449-.549.114-.229.168-.513.168-.854 0-.671-.19-1.151-.572-1.443-.38-.293-.882-.438-1.503-.438h-4.04v3.666h4.1zM16.847 15.3c.389.384.946.577 1.671.577.516 0 .963-.132 1.342-.396.379-.27.625-.563.738-.883h2.446c-.39 1.218-1.003 2.093-1.835 2.635-.835.543-1.839.812-3.012.812-.814 0-1.55-.134-2.213-.406a4.78 4.78 0 01-1.679-1.136 5.06 5.06 0 01-1.064-1.757c-.254-.68-.378-1.426-.378-2.239 0-.79.13-1.524.393-2.199a5.095 5.095 0 011.092-1.757 5.095 5.095 0 011.693-1.172c.657-.283 1.38-.427 2.166-.427.87 0 1.637.168 2.296.506.66.34 1.206.805 1.638 1.396.43.59.748 1.28.949 2.069.2.789.27 1.64.2 2.549h-7.276c.038.856.301 1.544.69 1.928zM18.38 9.78c-.326-.343-.831-.514-1.48-.514-.425 0-.779.071-1.067.217-.283.144-.514.326-.686.545a2.14 2.14 0 00-.371.672 4.33 4.33 0 00-.143.584h4.663c-.09-.726-.398-1.168-.916-1.504zM15.5 6h4.865v1.321H15.5V6z" />
    </svg>
  ),
}

export default function Footer({ lang }: FooterProps) {
  const socials = [
    { label: 'Twitter', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'Dribbble', href: '#' },
    { label: 'GitHub', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Behance', href: '#' },
  ]

  return (
    <footer className="relative pt-20 pb-10 px-6 border-t border-white/5">
      {/* Top: wide layout */}
      <div className="max-w-7xl mx-auto">
        {/* Main row */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-16">
          {/* Left */}
          <div className="flex flex-col gap-4">
            <a className="font-logo text-2xl font-bold tracking-tight">
              <span className="text-gradient">NOVA</span>
            </a>
            <p className="font-body text-sm text-white/30 max-w-xs leading-relaxed">
              {t('footer.made', lang)}
            </p>
          </div>

          {/* Center: nav links */}
          <div className="grid grid-cols-2 gap-x-16 gap-y-3">
            {['About', 'Work', 'Services', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="nav-link font-body text-sm text-white/30 hover:text-primary-light transition-colors duration-300"
                data-cursor-hover
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right: contact info */}
          <div className="flex flex-col gap-2 text-right">
            <span className="font-body text-sm text-white/30">hello@novastudio.com</span>
            <span className="font-body text-sm text-white/20">São Paulo, BR</span>
          </div>
        </div>

        {/* Social icons row */}
        <div className="flex items-center justify-center gap-5 mb-12">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/30 hover:text-primary-light hover:border-primary/30 border border-white/5 transition-all duration-300"
              data-cursor-hover
            >
              {socialIcons[s.label]}
            </a>
          ))}
        </div>

        {/* Bottom divider + copyright */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="font-body text-xs text-white/15">
            {t('footer.rights', lang)}
          </span>
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/10">
            Design & Development by NOVA
          </span>
        </div>
      </div>
    </footer>
  )
}
