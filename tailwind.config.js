/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A2647',
          light: '#144272',
          dark: '#061833',
        },
        accent: {
          yellow: '#FFD700',
          'yellow-light': '#FFE55C',
          'yellow-dark': '#E6C200',
        },
      },
    },
  },
  plugins: [],
} 