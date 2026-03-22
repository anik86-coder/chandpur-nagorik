import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;

plugins: [require('@tailwindcss/typography')]

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        kalpurush: ['Kalpurush', 'sans-serif'],
      },
    },
  },
}