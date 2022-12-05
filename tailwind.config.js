/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "massive": "10rem"
      },
      fontFamily: {
        kory: ["Baskerville Bold Italic", "sans-serif"]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}