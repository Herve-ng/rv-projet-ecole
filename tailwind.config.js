/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3e7',
          100: '#fce4c0',
          200: '#fad599',
          300: '#f8c672',
          400: '#f7b74b',
          500: '#f5a623',
          600: '#d88d1d',
          700: '#bb7417',
          800: '#9e5b11',
          900: '#81420b',
        },
        secondary: {
          50: '#e8f4fd',
          100: '#c3e3fa',
          200: '#9ed2f7',
          300: '#79c1f4',
          400: '#54b0f1',
          500: '#2f9fee',
          600: '#2786d1',
          700: '#1f6db4',
          800: '#175497',
          900: '#0f3b7a',
        },
        accent: {
          50: '#fff4ed',
          100: '#ffe4d1',
          200: '#ffd4b5',
          300: '#ffc499',
          400: '#ffb47d',
          500: '#ffa461',
          600: '#e68d52',
          700: '#cc7643',
          800: '#b35f34',
          900: '#994825',
        },
      },
    },
  },
  plugins: [],
}
