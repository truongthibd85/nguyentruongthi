/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#e42327',
          yellow: '#ffce07',
          green: '#00B201',
          black: '#000000',
          white: '#ffffff',
        },
        dark: '#1a1a1a',
        light: '#FAFAFA',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};