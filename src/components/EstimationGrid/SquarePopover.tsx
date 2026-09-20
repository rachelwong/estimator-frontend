import type { RefObject } from 'react'
import { POPOVER_BULLET_CLASS } from '@/constants'
import { cn } from '@/lib/utils'
import { GridFloat } from './GridFloat'

interface SquarePopoverProps {
  anchorKey: string
  boundsRef: RefObject<HTMLElement | null>
  title: string
  names: string[]
}

// Everyone on a revealed Square, pinned open by a click (§6). Every name gets a
// row — no "+ N more" — and a long one ends in an ellipsis. No close button:
// the same Square again, or Esc, closes it.
export function SquarePopover({ anchorKey, boundsRef, title, names }: SquarePopoverProps) {
  return (
    <GridFloat
      anchorKey={anchorKey}
      boundsRef={boundsRef}
      role="dialog"
      ariaLabel={title}
      className="z-30 flex w-[190px] flex-col gap-2 bg-ink px-3 pt-3 pb-2.5 text-cream shadow-px-accent tablet:w-[210px]"
    >
      <span className="font-label text-[11px]">{title}</span>

      <ul className="flex flex-col gap-1">
        {names.map((name, index) => (
          <li key={name} className="flex items-center gap-2 text-[14px] font-semibold">
            <span
              className={cn('size-2 shrink-0', POPOVER_BULLET_CLASS[index % POPOVER_BULLET_CLASS.length])}
            />
            <span className="max-w-[140px] truncate tablet:max-w-[160px]">{name}</span>
          </li>
        ))}
      </ul>
    </GridFloat>
  )
}
