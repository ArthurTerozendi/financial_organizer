/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "dark-gray": "#2F3B51",
        purple: "#4D18B4",
        "dark-purple": "#36117E",
        "light-purple": "#af50db",
        blue: "#1A3EB4",
        "dark-blue": "#122B7E",
      },
    },
  },

  plugins: [],
};
