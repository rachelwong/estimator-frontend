import { DITHER_BAYER_MATRIX, DITHER_GLOW_DEPTH_PX, DITHER_PIXEL_PX } from '@/constants'

// Every value in the Welcome page's dither matrix, lowest first (§7 item 4).
export function ditherValues(): number[] {
  return DITHER_BAYER_MATRIX.flat().toSorted((a, b) => a - b)
}

// The one cell a matrix value owns in a tile of the dither, as a DITHER_PIXEL_PX
// square — the band repeats it across its width by an SVG pattern.
export function ditherCellPath(value: number): string {
  const row = DITHER_BAYER_MATRIX.findIndex((cells) => cells.some((cell) => cell === value))
  const column = DITHER_BAYER_MATRIX[row].findIndex((cell) => cell === value)
  const x = column * DITHER_PIXEL_PX
  const y = row * DITHER_PIXEL_PX

  return `M${x} ${y}h${DITHER_PIXEL_PX}v${DITHER_PIXEL_PX}h-${DITHER_PIXEL_PX}z`
}

// How far down a matrix value's cells reach at the glow's centre: the lowest
// value fills the whole depth, each value above it a sixteenth less.
export function ditherGlowRadiusY(value: number): number {
  const levels = DITHER_BAYER_MATRIX.flat().length

  return (DITHER_GLOW_DEPTH_PX * (levels - value)) / levels
}
