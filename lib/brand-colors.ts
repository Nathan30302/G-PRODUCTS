/**
 * Official G-Products brand colors — from the logo lockup.
 * Lime yellow (#E5F34F) → lime green (#C8E03F) on navy (#243F50).
 * Splash navy sampled from g-products-lockup-navy.png corner pixels.
 */
export const brandColors = {
  slate: "#243F50",
  /** Slightly lighter navy — subtle center glow on splash screens. */
  slateGlow: "#2A4D61",
  /** Darker navy — splash screen edge depth. */
  slateEdge: "#1A3342",
  slateDark: "#1a2f3c",
  yellow: "#E5F34F",
  yellowSoft: "#EDF76A",
  green: "#C8E03F",
  greenSoft: "#D4E855",
  greenDark: "#A8C832",
  white: "#FFFFFF"
} as const;

/** CSS linear gradient matching the G mark */
export const brandGradient =
  "linear-gradient(135deg, #E5F34F 0%, #C8E03F 100%)";
