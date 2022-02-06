module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  // darkMode: false, // or 'media' or 'class'
  darkMode: 'class',
  theme: {
    extend: {
       fontFamily: {
       Rampart: ['Raleway', "sans-serif"],
       Rampart: ['Roboto', "sans-serif"],
       Rampart: ['Allura', "sans-serif"],
       }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'),],
}
