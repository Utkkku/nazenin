/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'laden-pink': '#F3E5E4', // Soft Pastel Pink
        'laden-dark-pink': '#D4A5A5', // Dusty Rose
        'laden-green': '#EDF4F2', // Very Light Mint
        'laden-accent': '#8FA397', // Sage Green
        'laden-text': '#4A4A4A', // Soft Black
        'laden-gold': '#C5A065', // Subtle Gold
        canvas: '#f5f1ea',
        paper: '#f1e5d8',
        wood: {
          800: '#5f4332',
          900: '#3f2a1f',
        },
      },
      fontFamily: {
        // Tek font: Inter (latin-ext desteği tam, Türkçe karakterler sorunsuz)
        serif: ['"Inter"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
};


