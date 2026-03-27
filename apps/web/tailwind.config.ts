import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030014',
          900: '#070122',
          800: '#0b173a',
          700: '#142857',
          600: '#1f3b7a',
          500: '#3451a3',
          400: '#4b6ec4',
          neon: '#5ef1ff',
          magenta: '#ff7cc2',
          gold: '#ffd700',
          emerald: '#34d399',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 25px 50px -12px rgba(15, 23, 42, 0.45)',
        neon: '0 0 20px rgba(94, 241, 255, 0.35)',
        'neon-lg': '0 0 40px rgba(94, 241, 255, 0.25), 0 0 80px rgba(94, 241, 255, 0.1)',
        'magenta': '0 0 20px rgba(255, 124, 194, 0.35)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255,255,255,0.05)',
      },
      animation: {
        pulseSlow: 'pulseSlow 6s ease-in-out infinite',
        fadeIn: 'fadeIn 0.5s ease-out',
        slideUp: 'slideUp 0.5s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
        scaleIn: 'scaleIn 0.3s ease-out',
        spinSlow: 'spin 3s linear infinite',
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.8' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

export default config
