import { useState } from 'react'
import { EstimationGrid } from '@/components/EstimationGrid'
import { Window } from '@/components/Window'
import {
  COMPARISON_SQUARE_FIT,
  COMPARISON_WINDOW_BODY_CLASS,
  GridMode,
  WELCOME_CARD_HEADING_CLASS,
  WELCOME_DEMO_AXIS_VALUES,
  WELCOME_DEMO_REVEAL,
} from '@/constants'
import type { HoveredSquare, Selection } from '@/types'

// "At the Reveal": the same sample Session revealed, grid only. Its crowded
// Square opens the popover the caption points at.
export function RevealComparison() {
  const [hovered, setHovered] = useState<HoveredSquare | null>(null)
  const [pinned, setPinned] = useState<Selection | null>(null)

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <h3 className={WELCOME_CARD_HEADING_CLASS}>At the Reveal</h3>

      <Window title="revealed" bodyClassName={COMPARISON_WINDOW_BODY_CLASS}>
        <p className="self-start font-label text-[11px]">3 people? pick the Square to see who</p>

        <EstimationGrid
          axisValues={WELCOME_DEMO_AXIS_VALUES}
          mode={GridMode.READONLY}
          reveal={WELCOME_DEMO_REVEAL}
          hovered={hovered}
          onHoveredChange={setHovered}
          pinned={pinned}
          onPinnedChange={setPinned}
          squareFit={COMPARISON_SQUARE_FIT}
        />
      </Window>
    </div>
  )
}
