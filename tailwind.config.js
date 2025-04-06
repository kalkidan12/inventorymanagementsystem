/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a73e8", // Primary color (Divi-like)
        secondary: "#ff9800", // Secondary color (hover)
      },
      animation: {
        "spin-slow": "spin 10s linear infinite",
        "fade-in": "fadeIn 2s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },

      boxShadow: {
        divi: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      fontFamily: {
        body: ["Poppins", "sans-serif"], // Divi body font
        heading: ["Merriweather", "serif"], // Divi heading font
      },
    },
  },
  plugins: [],
};
