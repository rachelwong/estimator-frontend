import { PIXEL_BAR_CLASS, PixelBarSize } from '@/constants'
import { cn } from '@/lib/utils'
import type { PixelBarSize as PixelBarSizeType } from '@/types'

interface PixelProgressBarProps {
  size?: PixelBarSizeType
  className?: string
}

// The loader (DESIGN.md §7, option C). An accent fill steps across a white
// track in whole blocks and starts again; the white gaps are a repeating
// gradient laid over the fill, since the fill is one growing element.
//
// It reports nothing — the wait is unmeasured, so there is no value a
// progressbar role could carry. The line of text beside it is what gets
// announced, from the `role="status"` its container owns. Decorative here,
// aria-hidden, exactly like a sprite.
export function PixelProgressBar({ size = PixelBarSize.LARGE, className }: PixelProgressBarProps) {
  const sizeClass = PIXEL_BAR_CLASS[size]

  return (
    <span
      aria-hidden="true"
      className={cn(
        // box-content, so the track is the width the block pitch was divided
        // from: 220/8 and 40/5 both only land on whole pixels inside the
        // border, not inside the border-box Tailwind would default to.
        'relative inline-block box-content border-[3px] border-ink bg-white shadow-px',
        sizeClass.track,
        className,
      )}
    >
      {/* w-full is the resting width, which only shows when the animation
          isn't running. Under reduced motion that leaves the bar full and
          still; without it the fill would shrink to nothing and read as an
          empty track rather than a wait. */}
      <span className={cn('absolute inset-y-0 left-0 w-full bg-accent', sizeClass.fill)} />
      <span className={cn('absolute inset-0', sizeClass.blocks)} />
    </span>
  )
}
