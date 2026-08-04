import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"]
      },
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
        accent: {
          DEFAULT: "#22c98a",
          soft: "#4ade9f",
          dark: "#17a06d"
        }
      },
      borderRadius: {
        card: "1.25rem",
        xl2: "1.5rem",
        pill: "999px"
      },
      boxShadow: {
        card: "0 8px 30px rgba(0,0,0,0.35)",
        "card-hover":
          "0 18px 50px -12px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
        glow: "0 0 0 1px rgba(246,212,0,0.35), 0 10px 40px rgba(246,212,0,0.18)",
        "accent-glow": "0 10px 40px -8px rgba(34,201,138,0.45)",
        "brand-glow": "0 10px 40px -8px rgba(246,212,0,0.4)"
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" }
        },
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(16px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" }
        },
        "glow-breathe": {
          "0%, 100%": { opacity: "0.55", transform: "translate(-50%, 0) scale(1)" },
          "50%": { opacity: "0.9", transform: "translate(-50%, 0) scale(1.08)" }
        },
        "hero-rise": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "toast-in": "toast-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "glow-breathe": "glow-breathe 5.5s ease-in-out infinite",
        "hero-rise": "hero-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both"
      }
    }
  },
  plugins: []
};

export default config;
