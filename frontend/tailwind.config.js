/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(193, 150, 119)',
        'dark-primary': 'rgb(163, 120, 89)',
        'light-primary': 'rgba(193, 150, 119, 0.1)',
        white: 'rgb(255, 255, 255)',
        accent: 'rgb(106, 187, 62)',
        danger: 'rgb(241, 36, 36)',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
        'slideIn': 'slideIn 0.4s ease-out forwards',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 1s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        slideIn: {
          '0%': { opacity: 0, transform: 'translateX(-10px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' }
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(-2px)' },
          '50%': { transform: 'translateY(0)' },
        }
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      boxShadow: {
        'elegant': '0 10px 15px -3px rgba(193, 150, 119, 0.1), 0 4px 6px -2px rgba(193, 150, 119, 0.05)',
      }
    },
  },
  plugins: [],
}