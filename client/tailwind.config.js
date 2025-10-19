/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#011314",
        bgLight: "#182B29",
        logo: "#61D47B",
        accent: "#B8F966",
        text: "#B9C4C7",
        bold: "#B8F966",
        btn: "#BDFF65",
      },
      backgroundImage: {
        "gradient-main": "linear-gradient(90deg, #011314 0%, #182B29 100%)",
      },
    },
  },
  plugins: [],
};
