import { useId } from 'react'
import { DITHER_BAYER_MATRIX, DITHER_BLOCK_THRESHOLDS, DITHER_PIXEL_PX } from '@/constants'
import { ditherPath } from '@/utils'

// Where the lavender top breaks into 12px pixels over the cream (§7 item 4),
// just before How to play. One tile of the ordered dither, repeated across the
// band's width by an SVG pattern — so the pixels stay square at any width and
// nothing has to measure the page.
export function DitherBand() {
  const patternId = useId()
  const tileWidth = DITHER_BAYER_MATRIX[0].length * DITHER_PIXEL_PX
  const tileHeight = DITHER_BAYER_MATRIX.length * DITHER_BLOCK_THRESHOLDS.length * DITHER_PIXEL_PX

  return (
    <svg
      aria-hidden="true"
      className="block w-full bg-cream"
      height={tileHeight}
      shapeRendering="crispEdges"
    >
      <defs>
        <pattern id={patternId} width={tileWidth} height={tileHeight} patternUnits="userSpaceOnUse">
          <path className="fill-page-top" d={ditherPath()} />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill={`url('#${patternId}')`} />
    </svg>
  )
}
