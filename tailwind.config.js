/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./script.js"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#000000',
          primary: '#a32638',
          light: '#fce8eb',
          accent: '#c93545',
          surface: '#fff5f6',
          secondary: '#4a4a4a',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        '3d': '0 10px 40px -10px rgba(163, 38, 56, 0.25)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      }
    }
  },
  plugins: [],
}
