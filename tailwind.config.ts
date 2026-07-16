import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // G-Products palette - dark teal/petrol base from the logo banner
        ink: {
          950: "#06181c",
          900: "#0a2429",
          850: "#0e2e34",
          800: "#123b43",
          700: "#1b4e58",
          600: "#296571"
        },
        // Brand yellow - straight from the G-Products logo
        brand: {
          DEFAULT: "#f6d400",
          soft: "#ffe24d",
          dark: "#d9bb00"
        },
        // Green accent - WhatsApp, in-stock, savings
        accent: "#22c98a"
      },
      borderRadius: {
        card: "1rem",
        pill: "999px"
      },
      boxShadow: {
        card: "0 8px 30px rgba(0,0,0,0.35)",
        glow: "0 0 0 1px rgba(246,212,0,0.35), 0 8px 30px rgba(246,212,0,0.12)"
      }
    }
  },
  plugins: []
};

export default config;
