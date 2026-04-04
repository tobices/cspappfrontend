// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EBF0FA',
          100: '#D6E2F5',
          200: '#ADC5EB',
          300: '#85A8E0',
          400: '#5C8BD6',
          500: '#336ECC',
          600: '#1E3A8A',
          700: '#162C6B',
          800: '#0F1D4C',
          900: '#070F2E',
          DEFAULT: '#1E3A8A',
        },
        gold: {
          50: '#FBF8F2',
          100: '#F7F0E5',
          200: '#EFE1CB',
          300: '#E7D2B1',
          400: '#DFC397',
          500: '#D7B47D',
          600: '#D4AF77',
          700: '#C4A066',
          800: '#B49155',
          900: '#A48244',
          DEFAULT: '#D4AF77',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'spin-slow': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}