import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B3A6B',
          dark: '#0d2347',
          light: '#2a4f8f',
          50: '#EFF4FF',
          100: '#C3D3F0',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#e8c97a',
          dark: '#a07a2a',
          50: '#FDF8EC',
          100: '#F5E4B4',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: 'DM Sans, sans-serif',
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
