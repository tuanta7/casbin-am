/** @type {import('tailwindcss').Config} */

import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        bifrost: "url('/bifrost.png')",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["winter", "forest"],
  },
};
