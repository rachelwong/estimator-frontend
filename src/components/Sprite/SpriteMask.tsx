import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface SpriteMaskProps {
  /** A `.svg` imported from `@/assets/sprites`. Single-colour marks only. */
  source: string
  /** A background utility — the mask is painted in this colour, e.g. `bg-cream`. */
  colourClass: string
  className?: string
}

// A sprite recoloured to a palette token, for the one case the design asks for:
// the cream spade on the Reveal's dark notice (§7), where an ink spade on ink
// would be invisible.
//
// The sprite is a mask rather than an image, so `colourClass` paints the shape
// with the real token instead of a filter chain approximating it. Only use this
// on a single-colour mark: masking a character flattens its skin tone and
// outfit into one silhouette. Everything else renders through <Sprite>.
export function SpriteMask({ source, colourClass, className }: SpriteMaskProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('sprite-mask inline-block', colourClass, className)}
      // The URL is quoted because Vite inlines the sprite as a data URI that
      // re-quotes the SVG's own attributes with `'`, and a bare url() token
      // cannot contain quotes — unquoted, the whole declaration is dropped.
      style={{ '--sprite-source': `url("${source}")` } as CSSProperties}
    />
  )
}
