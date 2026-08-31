import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-jakarta)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif"
        ],
        display: [
          "var(--font-jakarta)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif"
        ],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"]
      },
      colors: {
        gp: {
          bg: "#FFFFFF",
          muted: "#F5F5F5",
          surface: "#FFFFFF",
          border: "#E8EBEA",
          text: {
            DEFAULT: "#1A2321",
            muted: "#5F6B68",
            subtle: "#8B9693"
          }
        },
        // G-Products slate — logo background #233746
        ink: {
          950: "#1a2834",
          900: "#1e2f3d",
          850: "#233746",
          800: "#233746",
          700: "#233746",
          600: "#4a6578"
        },
        // Logo gradient: lime yellow → lime green
        brand: {
          DEFAULT: "#E5F34F",
          soft: "#EDF76A",
          dark: "#C8E03F",
          yellow: "#E5F34F",
          green: "#C8E03F"
        },
        accent: {
          DEFAULT: "#C8E03F",
          soft: "#D4E855",
          dark: "#A8C832"
        },
        warm: {
          DEFAULT: "#e07a3a",
          soft: "#f4a261",
          dark: "#c8652a"
        }
      },
      borderRadius: {
        card: "1.25rem",
        xl2: "1.5rem",
        pill: "999px"
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.03), 0 6px 20px rgba(26,35,33,0.06)",
        "card-hover":
          "0 12px 32px rgba(26,35,33,0.1), 0 0 0 1px rgba(0,0,0,0.03)",
        float:
          "0 12px 40px -8px rgba(26,35,33,0.14), 0 4px 12px -4px rgba(26,35,33,0.08)",
        nav: "0 10px 40px rgba(26,35,33,0.14), 0 2px 8px rgba(26,35,33,0.06)",
        glow: "0 0 0 1px rgba(229,243,79,0.35), 0 10px 40px rgba(229,243,79,0.18)",
        "accent-glow": "0 10px 40px -8px rgba(35,55,70,0.22)",
        "brand-glow": "0 4px 14px -2px rgba(229,243,79,0.35)"
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
        "page-enter": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "toast-in": "toast-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "glow-breathe": "glow-breathe 5.5s ease-in-out infinite",
        "hero-rise": "hero-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        "page-enter": "page-enter 0.28s cubic-bezier(0.16, 1, 0.3, 1) both"
      }
    }
  },
  plugins: []
};

export default config;
