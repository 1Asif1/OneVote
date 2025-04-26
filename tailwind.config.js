/**  @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef7ff',
          100: '#d8edff',
          200: '#b9e0ff',
          300: '#8aceff',
          400: '#54b4ff',
          500: '#2c96fc',
          600: '#167ac6',
          700: '#1262a0',
          800: '#155484',
          900: '#17466d',
          950: '#0f2b46',
        },
      }
    },
  },
  plugins: [],
};
 