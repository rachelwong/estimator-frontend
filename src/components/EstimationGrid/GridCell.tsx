import type { FocusEventHandler, KeyboardEventHandler, PointerEventHandler } from 'react'
import { ChangeFlash } from '@/components/ChangeFlash'
import { SQUARE_HIGHLIGHT_CLASS, SQUARE_LABEL_SIZE_CLASS } from '@/constants'
import { cn } from '@/lib/utils'
import type {
  SquareHighlight as SquareHighlightValue,
  SquareLabelSize as SquareLabelSizeValue,
} from '@/types'

interface GridCellProps {
  squareKey: string
  size: number
  label: string
  labelSize: SquareLabelSizeValue
  fillClass: string
  highlight: SquareHighlightValue
  ariaLabel: string
  // Running grid only: whether this is your Selection.
  pressed?: boolean
  // Reveal only, on a Square someone landed on: whether its popover is open.
  expanded?: boolean
  // Reveal only: when this Square's part of the arriving wave starts (§8).
  revealDelay?: number
  // Reveal only: the wave is waiting to start, so the Square holds blank.
  isWavePaused?: boolean
  // Reveal only: someone just moved here, so its border flashes rainbow (§8).
  // A new id restarts the flash.
  flashId?: number
  // Off on a revealed Square nobody landed on: hovering it does nothing.
  hasPointerCursor: boolean
  // Roving: 0 on the one Square Tab lands on, −1 on the rest.
  tabIndex: number
  onClick: () => void
  onPointerEnter: PointerEventHandler<HTMLButtonElement>
  onFocus: FocusEventHandler<HTMLButtonElement>
  onBlur: FocusEventHandler<HTMLButtonElement>
  onKeyDown: KeyboardEventHandler<HTMLButtonElement>
}

// One Square. Every decision about it is made by EstimationGrid; this only
// draws it. Work (G6) shares its rules with its neighbours: a 1px right and
// bottom edge each, in a grid with no gap. `data-square` is how the grid finds it again to move focus and to
// anchor the tooltip and popover.
//
// Each line of the label is cut to the Square's width with an ellipsis, so a
// long name never runs past the edge whatever the font and Square size.
export function GridCell({
  squareKey,
  size,
  label,
  labelSize,
  fillClass,
  highlight,
  ariaLabel,
  pressed,
  expanded,
  revealDelay,
  isWavePaused = false,
  flashId,
  hasPointerCursor,
  tabIndex,
  onClick,
  onPointerEnter,
  onFocus,
  onBlur,
  onKeyDown,
}: GridCellProps) {
  return (
    <button
      type="button"
      data-square={squareKey}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-pressed={pressed}
      aria-expanded={expanded}
      className={cn(
        'relative border-2 border-border-subtle p-0.5 text-center font-label leading-tight outline-none transition-[translate,box-shadow,background-color] duration-[90ms,90ms,120ms] work:border-0 work:border-r work:border-b work:font-medium',
        hasPointerCursor ? 'cursor-pointer' : 'cursor-default',
        fillClass,
        SQUARE_LABEL_SIZE_CLASS[labelSize],
        SQUARE_HIGHLIGHT_CLASS[highlight],
        revealDelay !== undefined && 'animate-reveal-in',
        // Paused inside its delay, `backwards` keeps it on the first keyframe.
        isWavePaused && '[animation-play-state:paused]',
      )}
      style={{ width: size, height: size, animationDelay: revealDelay === undefined ? undefined : `${revealDelay}ms` }}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      <ChangeFlash flashId={flashId} />

      {/* The label clips here rather than on the button, which would cut away
          the change flash laid over its border. */}
      <span className="flex size-full flex-col items-center justify-center overflow-hidden">
        {label.split('\n').map((line) => (
          <span key={line} className="max-w-full truncate">
            {line}
          </span>
        ))}
      </span>
    </button>
  )
}
