// Dev-only. WCAG 2.1 relative luminance and contrast ratio.
//
// The numbers are measured from what the browser actually painted, not from a
// second copy of the hex kept here — so a token that never made it out of
// src/index.css reads as a failure instead of quietly reporting the ratio the
// design intended.

// Below this the sRGB transfer curve is linear; above it, the gamma branch.
const SRGB_LINEAR_CUTOFF = 0.03928

// The offset WCAG adds to both luminances so the ratio stays finite on black.
const LUMINANCE_OFFSET = 0.05

// Rec. 709 luma coefficients, which WCAG borrows.
const RED_WEIGHT = 0.2126
const GREEN_WEIGHT = 0.7152
const BLUE_WEIGHT = 0.0722

const BYTE_MAX = 255

// Normal-size body text. The design has no text below this bar (§2).
export const DEV_AA_NORMAL = 4.5

// getComputedStyle hands back "rgb(30, 27, 46)" or "rgba(30, 27, 46, 0.5)".
function parseRgb(colour: string): [number, number, number] | null {
  const parts = colour.match(/[\d.]+/g)

  if (!parts || parts.length < 3) {
    return null
  }

  return [Number(parts[0]), Number(parts[1]), Number(parts[2])]
}

function luminance([red, green, blue]: [number, number, number]): number {
  const [r, g, b] = [red, green, blue].map((channel) => {
    const value = channel / BYTE_MAX

    if (value <= SRGB_LINEAR_CUTOFF) {
      return value / 12.92
    }

    return ((value + 0.055) / 1.055) ** 2.4
  })

  return RED_WEIGHT * r + GREEN_WEIGHT * g + BLUE_WEIGHT * b
}

// null when either colour is unreadable — a missing token, or a transparent
// background the ratio would be meaningless against.
export function devContrast(background: string, foreground: string): number | null {
  const bg = parseRgb(background)
  const fg = parseRgb(foreground)

  if (!bg || !fg) {
    return null
  }

  const [lighter, darker] = [luminance(bg), luminance(fg)].sort((a, b) => b - a)

  return (lighter + LUMINANCE_OFFSET) / (darker + LUMINANCE_OFFSET)
}
