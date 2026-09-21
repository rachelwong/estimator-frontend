import { Chip } from '@/components/Chip'
import { ChipSize, FOCUS_VISIBLE_SELECTOR, HoverSource, MOUSE_POINTER_TYPE } from '@/constants'
import type { HoverSource as HoverSourceValue } from '@/types'

interface LandedChipProps {
  name: string
  // Whether this person's Square has its popover open.
  expanded: boolean
  onPreview: (source: HoverSourceValue) => void
  onPreviewEnd: (source: HoverSourceValue) => void
  onClick: () => void
}

// One name in "who landed where" (§6), standing in for its Square: hovering
// previews it, clicking pins its popover. The same rules as a Square's own
// hover — the mouse, or keyboard focus, never a tap. Either one tints the chip
// `crowd-0`.
export function LandedChip({ name, expanded, onPreview, onPreviewEnd, onClick }: LandedChipProps) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      className="group cursor-pointer outline-none focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ink"
      onClick={onClick}
      onPointerEnter={(event) => event.pointerType === MOUSE_POINTER_TYPE && onPreview(HoverSource.POINTER)}
      onPointerLeave={() => onPreviewEnd(HoverSource.POINTER)}
      onFocus={(event) => event.currentTarget.matches(FOCUS_VISIBLE_SELECTOR) && onPreview(HoverSource.KEYBOARD)}
      onBlur={() => onPreviewEnd(HoverSource.KEYBOARD)}
    >
      <Chip
        size={ChipSize.NAME}
        className="transition-colors duration-[120ms] group-hover:bg-crowd-0 group-focus-visible:bg-crowd-0"
      >
        <span className="max-w-[120px] truncate">{name}</span>
      </Chip>
    </button>
  )
}
