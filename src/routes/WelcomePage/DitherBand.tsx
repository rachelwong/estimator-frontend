import { useId } from 'react'
import {
  DITHER_BAYER_MATRIX,
  DITHER_GLOW_DEPTH_PX,
  DITHER_GLOW_RADIUS_PERCENT,
  DITHER_PIXEL_PX,
} from '@/constants'
import { ditherCellPath, ditherGlowRadiusY, ditherValues } from '@/utils'

// Where the lavender top glows down into the cream in 2px pixels (§7 item 4),
// just before How to use. Each matrix value's cell is its own SVG pattern tile,
// filling a half-ellipse hung from the top centre; the ellipses nest, so the
// dither thins towards their edges. Ellipse widths are percentages and the
// patterns sit in user space, so the pixels stay square at any width and
// nothing has to measure the page.
export function DitherBand() {
  const patternId = useId()
  const tileWidth = DITHER_BAYER_MATRIX[0].length * DITHER_PIXEL_PX
  const tileHeight = DITHER_BAYER_MATRIX.length * DITHER_PIXEL_PX

  return (
    <svg
      aria-hidden="true"
      className="block w-full bg-cream"
      height={DITHER_GLOW_DEPTH_PX}
      shapeRendering="crispEdges"
    >
      <defs>
        {ditherValues().map((value) => (
          <pattern
            key={value}
            id={`${patternId}-${value}`}
            width={tileWidth}
            height={tileHeight}
            patternUnits="userSpaceOnUse"
          >
            <path className="fill-page-top" d={ditherCellPath(value)} />
          </pattern>
        ))}
      </defs>

      {ditherValues().map((value) => (
        <ellipse
          key={value}
          cx="50%"
          cy={0}
          rx={`${DITHER_GLOW_RADIUS_PERCENT}%`}
          ry={ditherGlowRadiusY(value)}
          fill={`url('#${patternId}-${value}')`}
        />
      ))}
    </svg>
  )
}
