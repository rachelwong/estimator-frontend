import { DITHER_BAYER_MATRIX, DITHER_BLOCK_THRESHOLDS, DITHER_PIXEL_PX } from '@/constants'

// The Welcome page's dither band as one SVG path (§7 item 4): every cell that
// stays lavender, as a DITHER_PIXEL_PX square. It covers one tile — the
// matrix's four columns, and a block of its four rows per threshold — which the
// band repeats across its width.
export function ditherPath(): string {
  const rowsPerBlock = DITHER_BAYER_MATRIX.length

  return DITHER_BLOCK_THRESHOLDS.flatMap((threshold, block) =>
    DITHER_BAYER_MATRIX.flatMap((row, rowIndex) =>
      row.flatMap((value, column) => {
        if (value < threshold) {
          return []
        }

        const x = column * DITHER_PIXEL_PX
        const y = (block * rowsPerBlock + rowIndex) * DITHER_PIXEL_PX
        return [`M${x} ${y}h${DITHER_PIXEL_PX}v${DITHER_PIXEL_PX}h-${DITHER_PIXEL_PX}z`]
      }),
    ),
  ).join('')
}
