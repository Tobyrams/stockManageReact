/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  daisyui: {
    themes: ["lofi", "light", "nord", "dark", "business", "dim", "black"],
  },
  plugins: [require("daisyui"),require('tailwindcss-textshadow')],
};
