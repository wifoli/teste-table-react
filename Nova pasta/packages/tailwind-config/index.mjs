import colors from "./colors.mjs";

export default {
  darkMode: "class",
  theme: {
    extend: {
      colors,
      fontFamily: {
        app: ["Geist", "sans-serif"]
      },
      backgroundImage: {
        'sicoob-1': "url('/assets/images/padroes-01.jpg')",
      },
      screens: {
        '3xl': '1920px',
      }
    }
  },
  plugins: []
};
