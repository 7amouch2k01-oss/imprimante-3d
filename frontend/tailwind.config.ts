import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          light: '#FFFFFF',
          subtle: '#F8F9FA',
          muted: '#F1F3F5',
          border: '#E9ECEF',
          dark: '#111111',
        },
        eco: {
          50: '#EBF6EF',
          100: '#CEE8D6',
          200: '#9ED3AF',
          300: '#6CBD87',
          400: '#3BA75F',
          500: '#116B36', // Eco Leaf Green primary
          600: '#0E582C',
          700: '#0B4623',
          800: '#07331A',
          900: '#042010',
        },
        charcoal: {
          DEFAULT: '#111111',
          black: '#000000',
          muted: '#555555',
          subtle: '#777777',
        }
      },
    },
  },
  plugins: [],
};
export default config;
