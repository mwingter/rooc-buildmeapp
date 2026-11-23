import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        parchment: "#f5f1e8",
        guild: "#7c3aed",
        accent: "#d97706",
      },
    },
  },
  plugins: [],
} satisfies Config;
