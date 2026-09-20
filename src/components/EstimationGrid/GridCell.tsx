import { useRef, useState } from 'react'
import type { PointerEventHandler } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  AreaPreview,
  CELL_CLASS,
  CellState,
  CROWDED_SQUARE_MINIMUM,
  PREVIEW_CLASS,
} from '@/constants'
import { cn } from '@/lib/utils'
import type {
  AreaPreview as AreaPreviewValue,
  CellState as CellStateValue,
  ParticipantColours,
} from '@/types'
import { revealedSquareClass } from '@/utils'
import { SquareLabel } from './SquareLabel'

interface GridCellProps {
  state: CellStateValue
  names: string[]
  colours?: ParticipantColours
  preview?: AreaPreviewValue
  onClick?: () => void
  onPointerEnter?: PointerEventHandler<HTMLButtonElement>
}

// Clickable in two unrelated ways, never both: to choose a Square while the
// Session runs, or — once it has ended, and only where a crowd hides the
// names behind a count — to see who is in it. No keyboard navigation of the
// grid itself (decision #18).
export function GridCell({
  state,
  names,
  colours,
  preview = AreaPreview.OUTSIDE,
  onClick,
  onPointerEnter,
}: GridCellProps) {
  // The Reveal's tooltip is opened by a click and nothing else: no hover
  // anywhere on the ended screen, so touch and mouse behave the same.
  const [showNames, setShowNames] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const isRevealed = state === CellState.REVEALED

  const className = cn(
    'flex aspect-square items-center justify-center overflow-hidden rounded-sm p-0.5',
    CELL_CLASS[state],
    isRevealed && colours && revealedSquareClass(names, colours),
    preview === AreaPreview.INSIDE && PREVIEW_CLASS,
  )

  if (onClick) {
    return (
      <button
        type="button"
        className={cn(className, 'cursor-pointer')}
        onClick={onClick}
        onPointerEnter={onPointerEnter}
      >
        <SquareLabel names={names} />
      </button>
    )
  }

  // Only a crowded Square opens. A Square one person picked already says who
  // they are, on their own colour — there is nothing behind it to reveal.
  if (!isRevealed || names.length < CROWDED_SQUARE_MINIMUM) {
    return (
      <div className={className}>
        <SquareLabel names={names} />
      </div>
    )
  }

  // The badges are the only place a crowded Square's names appear: its face
  // carries the count.
  return (
    <Tooltip open={showNames}>
      <TooltipTrigger asChild>
        <button
          ref={triggerRef}
          type="button"
          className={cn(className, 'cursor-pointer')}
          aria-label={`Who picked this Square: ${names.join(', ')}`}
          onClick={() => setShowNames((open) => !open)}
        >
          <SquareLabel names={names} />
        </button>
      </TooltipTrigger>
      <TooltipContent
        className="flex-col items-start gap-1 p-2"
        onEscapeKeyDown={() => setShowNames(false)}
        onPointerDownOutside={(event) => {
          // This Square's own button counts as "outside" to Radix. Closing on
          // it here would race the click that toggles it, and the Square would
          // never shut — so leave its own button to the toggle.
          const target = event.detail.originalEvent.target as Node | null

          if (target && triggerRef.current?.contains(target)) {
            return
          }

          setShowNames(false)
        }}
      >
        {names.map((name) => (
          <span key={name} className={cn('rounded-sm px-1.5 py-0.5', colours?.get(name))}>
            {name}
          </span>
        ))}
      </TooltipContent>
    </Tooltip>
  )
}
