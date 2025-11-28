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
          neon: '#5ef1ff',
          magenta: '#ff7cc2',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 25px 50px -12px rgba(15, 23, 42, 0.45)',
        neon: '0 0 20px rgba(94, 241, 255, 0.35)',
      },
      animation: {
        pulseSlow: 'pulseSlow 6s ease-in-out infinite',
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: 0.35 },
          '50%': { opacity: 0.8 },
        },
      },
    },
  },
  plugins: [],
}

export default config
