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
      className="z-30 flex w-[190px] flex-col gap-2 rounded-panel bg-popover px-3 pt-3 pb-2.5 text-popover-foreground shadow-float tablet:w-[210px] work:w-[176px] work:border work:border-border work:px-3.5 work:py-3 work:tablet:w-[176px]"
    >
      <span className="font-label text-[11px] work:text-[12px] work:leading-4 work:text-subtle-foreground">{title}</span>

      <ul className="flex flex-col gap-1 work:gap-0">
        {names.map((name, index) => (
          <li key={name} className="flex items-center gap-2 text-[14px] font-semibold work:h-6 work:gap-2.5 work:font-normal">
            <span
              className={cn('size-2 shrink-0 work:rounded-[2px]', POPOVER_BULLET_CLASS[index % POPOVER_BULLET_CLASS.length])}
            />
            <span className="max-w-[140px] truncate tablet:max-w-[160px]">{name}</span>
          </li>
        ))}
      </ul>
    </GridFloat>
  )
}
