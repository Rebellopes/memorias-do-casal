import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['../../apps/**/*.{ts,tsx}', '../../packages/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        warm: {
          50: '#fdf8f6',
          100: '#f9ede8',
          200: '#f3d9cf',
          300: '#e9bca9',
          400: '#dd9579',
          500: '#d47a57',
          600: '#c4643d',
          700: '#a35030',
          800: '#86432c',
          900: '#6e3a27',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
