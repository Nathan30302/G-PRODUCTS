/**
 * Official G-Products brand colors — from the logo lockup.
 * Lime yellow (#E5F34F) → lime green (#C8E03F) on navy (#243F50).
 */
export const brandColors = {
  slate: "#243F50",
  slateDark: "#1a2f3c",
  slateEdge: "#0E1E26",
  yellow: "#E5F34F",
  yellowSoft: "#EDF76A",
  green: "#C8E03F",
  greenSoft: "#D4E855",
  greenDark: "#A8C832",
  /** Sampled deep green from G-mark in lockup PNG — Ray Bloom splash center. */
  greenDeep: "#33461F",
  /** Light green for splash ray bloom (#A9D17A). */
  rayGreen: "#A9D17A",
  white: "#FFFFFF"
} as const;

/** CSS linear gradient matching the G mark */
export const brandGradient =
  "linear-gradient(135deg, #E5F34F 0%, #C8E03F 100%)";
