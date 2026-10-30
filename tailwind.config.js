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
        vyapar: {
          blue: '#A9D9FF',
          skyblue: '#D9EEFF',
          navy: '#14283F',
          dark: '#111827',
          softgrey: '#F3F7FA',
          yellow: '#FFE58A',
          green: '#A9E8C0',
          red: '#FF9C9C',
          orange: '#FFD39B',
          purple: '#E0C3FC',
          pink: '#FFC6FF',
        },
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px #14283F',
        'brutal': '4px 4px 0px #14283F',
        'brutal-lg': '6px 6px 0px #14283F',
        'brutal-xl': '8px 8px 0px #14283F',
      },
      borderRadius: {
        'brutal': '14px',
        'brutal-lg': '18px',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
