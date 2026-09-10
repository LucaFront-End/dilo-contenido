/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dilo: {
          orange: '#FF5A00',
          'orange-dark': '#EA580C',
          'orange-light': '#FFF7ED',
          black: '#111111',
          dark: '#18181B',
        }
      },
      fontFamily: {
        space: ['"Space Grotesk"', 'sans-serif'],
        outfit: ['"Outfit"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
