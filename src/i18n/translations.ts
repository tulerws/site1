export const languages = {
  en: 'English',
  pt: 'Português',
} as const

export type Lang = keyof typeof languages

export const defaultLang: Lang = 'pt'

export const translations = {
  en: {
    // Nav
    'nav.about': 'About',
    'nav.work': 'Work',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'nav.lang': 'PT',

    // Preloader
    'preloader.entering': 'ENTERING THE SUPERNOVA',

    // Hero
    'hero.title.line1': 'WE CREATE',
    'hero.title.line2': 'DIGITAL',
    'hero.title.line3': 'FUTURES',
    'hero.subtitle': 'A creative studio crafting immersive digital experiences that push the boundaries of web design & technology.',
    'hero.cta': 'Explore our work',
    'hero.scroll': 'Scroll to discover',

    // Intro
    'intro.tag': '[ WHO WE ARE ]',
    'intro.headline': 'A creative studio crafting immersive digital experiences that push the boundaries of web design & technology.',
    'intro.text1': 'We are NOVA — a multidisciplinary team of designers, developers, and strategists who believe that the web should be more than functional. It should be unforgettable.',
    'intro.text2': 'From São Paulo to the world, we partner with ambitious brands and visionary founders to create digital products that stand at the intersection of art, technology, and human emotion.',
    'intro.stat1.number': '50+',
    'intro.stat1.label': 'Projects Delivered',
    'intro.stat2.number': '12',
    'intro.stat2.label': 'Countries Reached',
    'intro.stat3.number': '8+',
    'intro.stat3.label': 'Years of Craft',

    // Manifesto
    'manifesto.tag': '[ OUR PHILOSOPHY ]',
    'manifesto.line1': 'We don\'t just build websites.',
    'manifesto.line2': 'We architect digital experiences',
    'manifesto.line3': 'that resonate, captivate,',
    'manifesto.line4': 'and transcend expectations.',

    // Work
    'work.tag': '[ SELECTED WORK ]',
    'work.title': 'Featured Projects',
    'work.viewProject': 'View Project',
    'work.projects': [
      {
        title: 'Ethereal',
        category: 'Branding & Web',
        description: 'A luxury fashion brand reimagined for the digital age.',
        year: '2026',
      },
      {
        title: 'Synapse',
        category: 'Product Design',
        description: 'AI-powered platform with an interface that feels alive.',
        year: '2025',
      },
      {
        title: 'Void',
        category: 'Immersive Experience',
        description: 'A WebGL journey through generative art landscapes.',
        year: '2025',
      },
      {
        title: 'Pulse',
        category: 'App & Motion',
        description: 'Fintech dashboard that transforms data into poetry.',
        year: '2026',
      },
    ],

    // Services
    'services.tag': '[ WHAT WE DO ]',
    'services.title': 'Services',
    'services.items': [
      {
        title: 'Design',
        description: 'Brand identity, UI/UX, motion design, and art direction that captivates.',
        icon: 'design',
      },
      {
        title: 'Development',
        description: 'High-performance web applications built with cutting-edge technology.',
        icon: 'dev',
      },
      {
        title: 'Experience',
        description: 'Immersive 3D, WebGL, and interactive installations that mesmerize.',
        icon: 'experience',
      },
      {
        title: 'Strategy',
        description: 'Data-driven insights that transform vision into measurable impact.',
        icon: 'strategy',
      },
    ],

    // About
    'about.tag': '[ ABOUT US ]',
    'about.title': 'We are NOVA',
    'about.description': 'A collective of designers, developers, and dreamers dedicated to pushing the boundaries of what\'s possible on the web.',
    'about.stats': [
      { number: '50+', label: 'Projects Delivered' },
      { number: '12', label: 'Team Members' },
      { number: '8', label: 'Countries Served' },
    ],

    // Contact
    'contact.tag': '[ GET IN TOUCH ]',
    'contact.title': 'Let\'s build something extraordinary',
    'contact.subtitle': 'Ready to elevate your digital presence? Drop us a line.',
    'contact.placeholder': 'your@email.com',
    'contact.cta': 'Start a project',

    // Clients
    'clients.tag': '[ TRUSTED BY ]',
    'clients.testimonials': [
      {
        quote: 'NOVA completely transformed our digital presence. Their attention to detail and creative vision is unmatched.',
        author: 'Sarah Chen',
        role: 'CEO',
        company: 'Aurora Tech',
      },
      {
        quote: 'Working with NOVA felt like having a creative partner, not just an agency. The results speak for themselves.',
        author: 'Marcus Rivera',
        role: 'Creative Director',
        company: 'Vertex Studio',
      },
      {
        quote: 'They don\'t just build websites — they craft experiences. Our conversion rate increased 340% after the redesign.',
        author: 'Elena Vogt',
        role: 'Head of Digital',
        company: 'Cipher Group',
      },
    ],

    // Footer
    'footer.rights': '© 2026 NOVA Studio. All rights reserved.',
    'footer.made': 'Crafted with obsession',
  },

  pt: {
    // Nav
    'nav.work': 'Projetos',
    'nav.services': 'Serviços',
    'nav.about': 'Sobre',
    'nav.contact': 'Contato',
    'nav.lang': 'EN',

    // Preloader
    'preloader.entering': 'ENTRANDO NA SUPERNOVA',

    // Hero
    'hero.title.line1': 'NÓS CRIAMOS',
    'hero.title.line2': 'FUTUROS',
    'hero.title.line3': 'DIGITAIS',
    'hero.subtitle': 'Um estúdio criativo que cria experiências digitais imersivas que expandem os limites do design & tecnologia.',
    'hero.cta': 'Explore nosso trabalho',
    'hero.scroll': 'Role para descobrir',

    // Intro
    'intro.tag': '[ QUEM SOMOS ]',
    'intro.headline': 'Um estúdio criativo que cria experiências digitais imersivas que expandem os limites do design & tecnologia.',
    'intro.text1': 'Somos a NOVA — uma equipe multidisciplinar de designers, desenvolvedores e estrategistas que acreditam que a web deve ser mais do que funcional. Deve ser inesquecível.',
    'intro.text2': 'De São Paulo para o mundo, nos unimos a marcas ambiciosas e fundadores visionários para criar produtos digitais que estão na interseção entre arte, tecnologia e emoção humana.',
    'intro.stat1.number': '50+',
    'intro.stat1.label': 'Projetos Entregues',
    'intro.stat2.number': '12',
    'intro.stat2.label': 'Países Alcançados',
    'intro.stat3.number': '8+',
    'intro.stat3.label': 'Anos de Ofício',

    // Manifesto
    'manifesto.tag': '[ NOSSA FILOSOFIA ]',
    'manifesto.line1': 'Nós não apenas construímos sites.',
    'manifesto.line2': 'Nós arquitetamos experiências digitais',
    'manifesto.line3': 'que ressoam, cativam,',
    'manifesto.line4': 'e transcendem expectativas.',

    // Work
    'work.tag': '[ TRABALHOS SELECIONADOS ]',
    'work.title': 'Projetos em Destaque',
    'work.viewProject': 'Ver Projeto',
    'work.projects': [
      {
        title: 'Ethereal',
        category: 'Branding & Web',
        description: 'Uma marca de moda luxuosa reimaginada para a era digital.',
        year: '2026',
      },
      {
        title: 'Synapse',
        category: 'Design de Produto',
        description: 'Plataforma com IA e uma interface que parece viva.',
        year: '2025',
      },
      {
        title: 'Void',
        category: 'Experiência Imersiva',
        description: 'Uma jornada WebGL por paisagens de arte generativa.',
        year: '2025',
      },
      {
        title: 'Pulse',
        category: 'App & Motion',
        description: 'Dashboard fintech que transforma dados em poesia.',
        year: '2026',
      },
    ],

    // Services
    'services.tag': '[ O QUE FAZEMOS ]',
    'services.title': 'Serviços',
    'services.items': [
      {
        title: 'Design',
        description: 'Identidade de marca, UI/UX, motion design e direção de arte que cativa.',
        icon: 'design',
      },
      {
        title: 'Desenvolvimento',
        description: 'Aplicações web de alta performance com tecnologia de ponta.',
        icon: 'dev',
      },
      {
        title: 'Experiência',
        description: 'Instalações 3D imersivas, WebGL e interativas que hipnotizam.',
        icon: 'experience',
      },
      {
        title: 'Estratégia',
        description: 'Insights orientados por dados que transformam visão em impacto mensurável.',
        icon: 'strategy',
      },
    ],

    // About
    'about.tag': '[ SOBRE NÓS ]',
    'about.title': 'Nós somos a NOVA',
    'about.description': 'Um coletivo de designers, desenvolvedores e sonhadores dedicados a expandir os limites do que é possível na web.',
    'about.stats': [
      { number: '50+', label: 'Projetos Entregues' },
      { number: '12', label: 'Membros do Time' },
      { number: '8', label: 'Países Atendidos' },
    ],

    // Contact
    'contact.tag': '[ ENTRE EM CONTATO ]',
    'contact.title': 'Vamos criar algo extraordinário',
    'contact.subtitle': 'Pronto para elevar sua presença digital? Mande uma mensagem.',
    'contact.placeholder': 'seu@email.com',
    'contact.cta': 'Iniciar um projeto',

    // Clients
    'clients.tag': '[ CONFIADO POR ]',
    'clients.testimonials': [
      {
        quote: 'A NOVA transformou completamente nossa presença digital. A atenção aos detalhes e a visão criativa são incomparáveis.',
        author: 'Sarah Chen',
        role: 'CEO',
        company: 'Aurora Tech',
      },
      {
        quote: 'Trabalhar com a NOVA foi como ter um parceiro criativo, não apenas uma agência. Os resultados falam por si.',
        author: 'Marcus Rivera',
        role: 'Diretor Criativo',
        company: 'Vertex Studio',
      },
      {
        quote: 'Eles não apenas constroem sites — eles criam experiências. Nossa taxa de conversão aumentou 340% após o redesign.',
        author: 'Elena Vogt',
        role: 'Head de Digital',
        company: 'Cipher Group',
      },
    ],

    // Footer
    'footer.rights': '© 2026 NOVA Studio. Todos os direitos reservados.',
    'footer.made': 'Feito com obsessão',
  },
} as const

export function t(key: string, lang: Lang = defaultLang): any {
  const dict = translations[lang] as Record<string, any>
  if (key in dict) return dict[key]
  return key
}
