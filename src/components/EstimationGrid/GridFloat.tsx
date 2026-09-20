import { useLayoutEffect, useRef } from 'react'
import type { AriaRole, ReactNode, RefObject } from 'react'
import { FLOAT_OFFSET_PX } from '@/constants'
import { cn } from '@/lib/utils'

interface GridFloatProps {
  anchorKey: string
  // The visible grid: the float never pokes out past its sides.
  boundsRef: RefObject<HTMLElement | null>
  role: AriaRole
  ariaLabel?: string
  className?: string
  children: ReactNode
}

// A box FLOAT_OFFSET_PX above one Square, centred on it but clamped inside the
// grid (§6) — what the tooltip and the popover share.
//
//        ┌──────────┐            ┌──────────┐
//        │ tooltip  │            │ tooltip  │  ← pushed in at the edge
//        └──────────┘            └──────────┘
//             ▢                  ▢
//   ├──────── grid ────────┤     ├──────── grid ────────┤
//
// Measured after layout, since the clamp needs the box's own width. Its
// offset parent sits outside the grid's scroller, so it isn't clipped by the
// horizontal scroll a big grid gets on a phone. Positioned straight on the
// node, before paint: nothing else depends on the numbers.
export function GridFloat({
  anchorKey,
  boundsRef,
  role,
  ariaLabel,
  className,
  children,
}: GridFloatProps) {
  const floatRef = useRef<HTMLDivElement>(null)

  // No dependency list: the anchor moves with every hover, scroll and resize,
  // and each of those re-renders the grid.
  useLayoutEffect(() => {
    const float = floatRef.current
    const bounds = boundsRef.current
    const parent = float?.offsetParent
    const anchor = bounds?.querySelector(`[data-square="${anchorKey}"]`)

    if (!float || !bounds || !parent || !anchor) {
      return
    }

    const square = anchor.getBoundingClientRect()
    const grid = bounds.getBoundingClientRect()
    const origin = parent.getBoundingClientRect()
    const centred = square.left + square.width / 2 - float.offsetWidth / 2
    const left = Math.max(grid.left, Math.min(centred, grid.right - float.offsetWidth))

    float.style.left = `${left - origin.left}px`
    float.style.top = `${square.top - origin.top - float.offsetHeight - FLOAT_OFFSET_PX}px`
  })

  return (
    <div ref={floatRef} role={role} aria-label={ariaLabel} className={cn('absolute', className)}>
      {children}
    </div>
  )
}
