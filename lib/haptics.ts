/** Light haptic tap for cart, login, and checkout actions (mobile). */
export function hapticTap(kind: "light" | "medium" | "success" = "light") {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  const pattern: number | number[] =
    kind === "success" ? [12, 40, 12] : kind === "medium" ? 18 : 10;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* unsupported */
  }
}
