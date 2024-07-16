import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Noto Sans', 'Arial', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
