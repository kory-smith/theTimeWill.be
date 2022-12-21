/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "massive": "14rem"
      },
      fontFamily: {
        kory: ["Baskerville Bold Italic", "sans-serif"],
        avenir: ["Avenir Heavy", "sans-serif"],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}