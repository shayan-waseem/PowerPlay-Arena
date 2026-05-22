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
        neonPurple: '#a855f7',
        neonBlue: '#06b6d4',
        neonPink: '#ec4899',
        neonGreen: '#10b981',
      },
      boxShadow: {
        glowPurple: '0 0 15px rgba(168, 85, 247, 0.4)',
        glowBlue: '0 0 15px rgba(6, 182, 212, 0.4)',
        glowPink: '0 0 15px rgba(236, 72, 153, 0.4)',
        glowGreen: '0 0 15px rgba(16, 185, 129, 0.4)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%': { boxShadow: '0 0 5px rgba(6, 182, 212, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
