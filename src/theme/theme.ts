/**
 * TRIMOVA_THEME — single source of truth for the admin panel design tokens.
 *
 * These exact values are also mirrored in:
 *   - tailwind.config.ts  (as utility classes, e.g. `bg-accent`)
 *   - src/theme/globals.css (as CSS custom properties, e.g. `var(--accent)`)
 *
 * Import this object directly when a token is needed in JS/TS (e.g. for
 * Recharts colours, inline styles, or runtime calculations).
 */
export const TRIMOVA_THEME = {
  bg: "#F5F6F8",
  surface: "#FFFFFF",
  surfaceAlt: "#F1F2F3",
  border: "#E2E8F8",
  text: "#1A202C",
  textMuted: "#718096",
  textFaint: "#A0AEC0",
  accent: "#3C3CB9", // Main Primary Color
  accentSoft: "#E0E0FF", // Light Accent
  danger: "#E53E3E", // Red for flags/suspensions
  success: "#38A169", // Green for success/payouts
  warning: "#D69E2E", // Amber for investigations
  overlay: "rgba(0,0,0,0.4)",
} as const;

export type TrimovaTheme = typeof TRIMOVA_THEME;
export type TrimovaColorToken = keyof TrimovaTheme;
