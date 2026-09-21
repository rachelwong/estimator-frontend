import { useState } from 'react'
import { EstimationGrid } from '@/components/EstimationGrid'
import { Window } from '@/components/Window'
import {
  COMPARISON_SQUARE_FIT,
  COMPARISON_WINDOW_BODY_CLASS,
  GridMode,
  WELCOME_CARD_HEADING_CLASS,
  WELCOME_DEMO_AXIS_VALUES,
  WELCOME_DEMO_SELECTION,
} from '@/constants'
import type { HoveredSquare, Selection } from '@/types'
import { isSameSquare } from '@/utils'

// "While you pick": the running grid with a Selection and its Area. It answers a
// click the way a Session does — another Square moves the Selection, the same
// one clears it — only nothing is sent anywhere.
export function SelectionDemo() {
  const [selection, setSelection] = useState<Selection | null>(WELCOME_DEMO_SELECTION)
  const [hovered, setHovered] = useState<HoveredSquare | null>(null)

  function handleSelect(square: Selection) {
    const isSame = selection !== null && isSameSquare(selection, square)
    setSelection(isSame ? null : square)
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <h3 className={WELCOME_CARD_HEADING_CLASS}>While you pick</h3>

      <Window title="live" bodyClassName={COMPARISON_WINDOW_BODY_CLASS}>
        <p className="self-start font-label text-[11px]">only you see your Selection and its Area</p>

        <EstimationGrid
          axisValues={WELCOME_DEMO_AXIS_VALUES}
          mode={GridMode.INTERACTIVE}
          selection={selection}
          onSelect={handleSelect}
          hovered={hovered}
          onHoveredChange={setHovered}
          squareFit={COMPARISON_SQUARE_FIT}
        />
      </Window>
    </div>
  )
}
