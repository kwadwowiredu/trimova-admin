import type { Config } from "tailwindcss";

/**
 * Trimova Admin design system.
 * Colour tokens are sourced from src/theme/theme.ts (TRIMOVA_THEME) and exposed
 * here as Tailwind utilities AND as CSS variables (see globals.css) so components
 * can use either `bg-accent` or `var(--accent)` interchangeably.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F5F6F8",
        surface: "#FFFFFF",
        "surface-alt": "#F1F2F3",
        border: "#E2E8F8",
        text: "#1A202C",
        "text-muted": "#718096",
        "text-faint": "#A0AEC0",
        accent: {
          DEFAULT: "#3C3CB9",
          soft: "#E0E0FF",
        },
        danger: "#E53E3E",
        success: "#38A169",
        warning: "#D69E2E",
      },
      backgroundColor: {
        overlay: "rgba(0,0,0,0.4)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
        drawer: "-8px 0 24px -8px rgba(16, 24, 40, 0.12)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "slide-in-right": "slide-in-right 0.25s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
