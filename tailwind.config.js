/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        "asap-purple": "#05405d",
        "asap-orange": "#48b2bc",
        "asap-white": "#ffffff",
        "asap-lowWhite": "#f6f8fc",
        "asap-pGradient": "#3f62aa",
        "asap-blue": "#05405d",
        "asap-gray": "#F2F3F9",
        "asap-gray-900": "#E9E9EB",
        "asap-switch": "#CECFCF",
        "asap-prgressBar": "#9fe7f5",
        "asap-text": "#6F6E81",
        "asap-blue-900": "#05405d",
        "asap-blue-600": "#429fbd",
        "asap-blue-300": "#9fe7f5",
        "diggow-orange": " #F7AD1B",
        "diggow-primary": "#45a3db",
        "diggow-secondary": "#4cbbb6",
        "diggow-blue": "#3F61AA",
        "diggow-dark-300": "#283046",
      },
      fontFamily: {
        CityOfEmber: ["Helvetica , sans-serif"],
        // Montserrat: ["Helvetica , sans-serif "],
        Montserrat: ["Gotham , sans-serif "],
      },

    },
  },
  variants: {
    display: ["group-hover"],
    extend: {},
  },

  plugins: [],
}
