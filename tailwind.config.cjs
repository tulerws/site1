/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#080c08',
          light: '#0f160f',
          card: '#111a11',
        },
        primary: {
          DEFAULT: '#7FA653',
          light: '#99CD85',
          muted: '#CFE0BC',
          dark: '#63783D',
          deep: '#3d4f25',
        },
        accent: {
          warm: '#C4A35A',
          sand: '#D4C4A0',
          amber: '#B8934A',
          sage: '#8A9A6C',
          stone: '#9C8E7A',
        },
        surface: {
          50: '#f0f4ec',
          100: '#dce5d4',
          200: '#b8c9a8',
          300: '#8fa87a',
          400: '#6b8a52',
          500: '#4a6636',
          600: '#364d28',
          700: '#26361c',
          800: '#1a2613',
          900: '#0f160f',
        },
        neutral: {
          50: '#f5f5f0',
          100: '#e8e8e0',
          200: '#d4d4c8',
          300: '#a8a89c',
          400: '#78786e',
          500: '#52524a',
        },
      },
      fontFamily: {
        display: ['"Clash Display"', 'sans-serif'],
        logo: ['"Syne"', 'sans-serif'],
        body: ['"Cabinet Grotesk"', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
