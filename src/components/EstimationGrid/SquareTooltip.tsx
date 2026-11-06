import type { RefObject } from 'react'
import { GridFloat } from './GridFloat'

interface SquareTooltipProps {
  anchorKey: string
  boundsRef: RefObject<HTMLElement | null>
  text: string
}

// One line over the hovered Square (§6). No arrow. Never takes the pointer, so
// it can't steal the hover from the Square beneath it.
export function SquareTooltip({ anchorKey, boundsRef, text }: SquareTooltipProps) {
  return (
    <GridFloat
      anchorKey={anchorKey}
      boundsRef={boundsRef}
      role="tooltip"
      className="pointer-events-none z-20 rounded-control bg-inverse px-[11px] py-2 font-label text-[11px] whitespace-nowrap text-inverse-foreground work:flex work:h-8 work:items-center work:px-3 work:py-0 work:text-[12px] work:font-medium work:tabular-nums work:shadow-float"
    >
      {text}
    </GridFloat>
  )
}
