import type { ReactNode } from 'react'

interface PlaceholderCopyProps {
  children: ReactNode
}

// PLACEHOLDER COPY — text still to be supplied (DESIGN.md §10), marked on the
// page as the artboard marks it: a `crowd-0` highlight over a dashed ink rule.
// Stage 10 replaces every use and deletes this.
export function PlaceholderCopy({ children }: PlaceholderCopyProps) {
  return (
    <span className="box-decoration-clone border-b-2 border-dashed border-ink bg-crowd-0 px-[3px]">
      {children}
    </span>
  )
}
