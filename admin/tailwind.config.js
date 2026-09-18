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
        eco: {
          50: '#F0F9F4',
          100: '#DCF2E4',
          500: '#116B36',
          600: '#0E572C',
          700: '#0A4322',
        },
        charcoal: {
          light: '#F8F9FA',
          border: '#E5E7EB',
          muted: '#6B7280',
          DEFAULT: '#1F2937',
          black: '#111111',
        },
      },
    },
  },
  plugins: [],
};
