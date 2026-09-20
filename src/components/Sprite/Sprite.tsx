import { cn } from '@/lib/utils'

interface SpriteProps {
  /** A `.svg` imported from `@/assets/sprites` — Vite inlines each one as a data URI. */
  source: string
  className?: string
}

// One pixel-art sprite (DESIGN.md §9). A plain <img>: the sprites ship as SVG
// and are imported directly, so a typo'd path fails the build rather than 404ing
// in front of a user, and each one is inlined rather than fetched.
//
// Every sprite is decorative. An empty alt already takes an image out of the
// accessibility tree; aria-hidden says the same thing to anything that reads
// the DOM instead, and neither can be forgotten at a call site because the
// wrapper is the only way a sprite gets rendered.
export function Sprite({ source, className }: SpriteProps) {
  return <img src={source} alt="" aria-hidden="true" className={cn('sprite-pixels', className)} />
}
