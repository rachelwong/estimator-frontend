import type { ReactNode } from 'react'
import { CHIP_SIZE_CLASS, CHIP_VARIANT_CLASS, ChipSize, ChipVariant } from '@/constants'
import { cn } from '@/lib/utils'
import type { ChipSize as ChipSizeType, ChipVariant as ChipVariantType } from '@/types'

interface ChipProps {
  children: ReactNode
  variant?: ChipVariantType
  size?: ChipSizeType
  className?: string
}

// A small squared label with a 2px edge and no shadow (DESIGN.md §4). It does
// two jobs at two heights: the Silkscreen status label in a Window's title bar,
// and a person's name in the Reveal's "who landed where" row.
//
// The fill is left to the caller, because it carries meaning the chip itself
// doesn't know — `copied` for a live session, `crowd-0` for a note. Solid chips
// start white; a dashed one stays transparent so the page shows through, which
// is what makes Abstained read as an absence rather than another entry.
export function Chip({
  children,
  variant = ChipVariant.SOLID,
  size = ChipSize.LABEL,
  className,
}: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center whitespace-nowrap border-2 text-ink',
        CHIP_VARIANT_CLASS[variant],
        CHIP_SIZE_CLASS[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
