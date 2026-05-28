/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#080a10',
        darkCard: '#101424',
        darkBorder: '#1d243e',
        darkSurface: '#0d1020',
        neonPurple: '#a855f7',
        neonBlue: '#06b6d4',
        neonCyan: '#22d3ee',
        neonPink: '#ec4899',
        neonGreen: '#10b981',
      },
      boxShadow: {
        glowPurple: '0 0 15px rgba(168, 85, 247, 0.4)',
        glowBlue: '0 0 15px rgba(6, 182, 212, 0.4)',
        glowPink: '0 0 15px rgba(236, 72, 153, 0.4)',
        glowGreen: '0 0 15px rgba(16, 185, 129, 0.4)',
        glowCyan: '0 0 15px rgba(34, 211, 238, 0.4)',
        innerGlow: 'inset 0 0 20px rgba(6, 182, 212, 0.06)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'gradient-x': 'gradientX 4s ease infinite',
        'fadeSlideUp': 'fadeSlideUp 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'spin-slower': 'spin 12s linear infinite',
        'count-flash': 'countFlash 0.6s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%': { boxShadow: '0 0 5px rgba(6, 182, 212, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(6, 182, 212, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeSlideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        countFlash: {
          '0%': { opacity: '0.5', transform: 'scale(0.95)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      }
    },
  },
  plugins: [],
}
