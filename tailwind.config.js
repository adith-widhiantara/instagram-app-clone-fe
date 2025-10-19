/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  darkMode: ["class"],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/alurkerja-ui/dist/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['Roboto', ...defaultTheme.fontFamily.sans] },
      borderColor: {
        DEFAULT: '#e2e8f0',
      },
      colors: {
        primary: '#004EEB',
        active: '#ECF0F7',
        red: {
          alurkerja: '#F64E60',
          'alurkerja-hovered': '#c13f4d',
        },
        orange: { alurkerja: '#FFA800', 'alurkerja-hovered': '#d98f00' },
        purple: { alurkerja: '#9056FC' },
        blue: { alurkerja: '#586BE2' },
        'main-blue': { alurkerja: '#0095E8', 'alurkerja-hovered': '#0084cd' },
        'tifany-blue': { alurkerja: '#17BCB4', 'alurkerja-hovered': '#15a3a0' },
        green: { alurkerja: '#50CD89', 'alurkerja-hovered': '#3cb77e' },
        'forst-white': { alurkerja: '#F3F6F9' },
        'light-blue': { alurkerja: '#E1F0FF' },
        black: {
          alurkerja: {
            1: '#1E1E2D',
            2: '#3F4254',
          },
        },
        gray: {
          alurkerja: {
            1: '#7E8299',
            2: '#B5B5C3',
            3: '#E4E6EF',
          },
          'alurkerja-hovered': {
            1: '#6d7083',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}
