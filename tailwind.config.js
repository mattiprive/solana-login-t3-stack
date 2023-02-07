/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        logo: ["Exo"],
      },
      backgroundImage: {
        bonsai: "url('/img/bonsai.jpg')",
        faq: "url('/img/bgfaq.png')",
        features: "url('/img/features.png')",
      },
    },
  },
  plugins: [],
};
