import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
}

// The smaller of the two framed surfaces: 3px ink edge, 6px offset shadow,
// square corners (DESIGN.md §4). A Window frames a whole screen; a Card is one
// item in a row of them — How to play, the repo cards.
//
// Hovered, or holding keyboard focus, it slides 6px down onto its shadow — a
// Square's hover lift run in reverse, at the same 90ms. Focus means
// focus-visible, so clicking a card's link doesn't leave it sunk.
//
// The fill is white here and overridden per card where the design tints them.
export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'border-[3px] border-ink bg-white p-5 shadow-px-card transition-[translate,box-shadow] duration-[90ms] hover:translate-x-[6px] hover:translate-y-[6px] hover:shadow-none has-focus-visible:translate-x-[6px] has-focus-visible:translate-y-[6px] has-focus-visible:shadow-none tablet:p-6 desktop:p-7',
        className,
      )}
    >
      {children}
    </div>
  )
}
