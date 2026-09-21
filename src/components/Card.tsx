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
// The fill is white here and overridden per card where the design tints them.
export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'border-[3px] border-ink bg-white p-5 shadow-px-card tablet:p-6 desktop:p-7',
        className,
      )}
    >
      {children}
    </div>
  )
}
