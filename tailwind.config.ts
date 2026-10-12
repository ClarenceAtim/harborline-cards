import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#10233f", soft: "#41526b", faint: "#8592a6" },
        harbor: { DEFAULT: "#0e4d64", dark: "#093548", light: "#e6f1f4" },
        signal: { DEFAULT: "#e8a317", dark: "#b97f06" },
        paper: "#f7f5f0",
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
