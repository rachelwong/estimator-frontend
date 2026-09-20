import { Fragment, useState } from 'react'
import type { PointerEvent } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AreaPreview, AXIS_HINT, AxisOrientation, GridMode, MOUSE_POINTER_TYPE } from '@/constants'
import type {
  GridMode as GridModeValue,
  ParticipantColours,
  RevealPayload,
  Selection,
} from '@/types'
import { cellState, groupNames, inArea, squareKey } from '@/utils'
import { AxisTitle } from './AxisTitle'
import { AxisValue } from './AxisValue'
import { GridCell } from './GridCell'

interface EstimationGridProps {
  axisValues: number[]
  mode: GridModeValue
  selection?: Selection | null
  reveal?: RevealPayload
  // Only the ended screen passes these; the live grid has no roster to colour.
  colours?: ParticipantColours
  onSelect?: (selection: Selection) => void
}

// Time runs left to right, Resources bottom to top — origin bottom-left:
//
//   Resources
//       8 │ ·  ·  ·
//       4 │ ·  ·  ·
//       0 │ ·  ·  ·
//         └─────────
//           0  4  8   Time
//
// axisValues stays ascending, as on the wire. Only the rows reverse, and only
// here. A Selection's resource is always an axis value, never a row index.
export function EstimationGrid({
  axisValues,
  mode,
  selection = null,
  reveal,
  colours,
  onSelect,
}: EstimationGridProps) {
  // The Square under a mouse pointer. Its Area is outlined as a preview.
  const [hovered, setHovered] = useState<Selection | null>(null)

  const rows = [...axisValues].reverse()
  const cols = axisValues
  const namesBySquare = groupNames(reveal)
  const isInteractive = mode === GridMode.INTERACTIVE

  // Mouse only: a tap fires pointerenter too, and would leave a ring stuck on.
  function handlePointerEnter(event: PointerEvent, square: Selection) {
    if (event.pointerType !== MOUSE_POINTER_TYPE) {
      return
    }

    setHovered(square)
  }

  // Leading auto column holds the Resources values.
  const gridStyle = {
    gridTemplateColumns: `auto repeat(${cols.length}, minmax(0, 1fr))`,
  }

  // Tooltips are a grid feature: AxisTitle and GridCell are the only consumers,
  // and both are this component's own sub-components, so the provider belongs at
  // the root of that unit rather than at the app root. Keeping it out of the root
  // also keeps Radix's tooltip and all of floating-ui out of the entry chunk,
  // which Welcome and Join never need. Move it up to the views only if a tooltip
  // ever appears outside the grid — Tooltip throws without a provider ancestor.
  return (
    <TooltipProvider>
      <div className="flex items-center gap-3">
        <AxisTitle
          label="Resources"
          hint={AXIS_HINT.RESOURCES}
          orientation={AxisOrientation.VERTICAL}
        />

        <div className="grid flex-1 gap-2">
          {/* Cleared on leaving the whole grid, not each cell, so the ring
              doesn't flicker across the gutters. */}
          <div className="grid gap-1" style={gridStyle} onPointerLeave={() => setHovered(null)}>
            {rows.map((resource) => (
              <Fragment key={resource}>
                <AxisValue value={resource} />

                {cols.map((time) => {
                  const square = { time, resource }
                  const names = namesBySquare.get(squareKey(time, resource)) ?? []
                  const preview =
                    isInteractive && hovered && inArea(square, hovered)
                      ? AreaPreview.INSIDE
                      : AreaPreview.OUTSIDE

                  return (
                    <GridCell
                      key={time}
                      state={cellState(mode, square, selection, names)}
                      names={names}
                      colours={colours}
                      preview={preview}
                      onClick={isInteractive ? () => onSelect?.(square) : undefined}
                      onPointerEnter={
                        isInteractive ? (event) => handlePointerEnter(event, square) : undefined
                      }
                    />
                  )
                })}
              </Fragment>
            ))}

            {/* Bottom row: blank corner under the Resources values, then Time values. */}
            <span />
            {cols.map((time) => (
              <AxisValue key={time} value={time} />
            ))}
          </div>

          <AxisTitle label="Time" hint={AXIS_HINT.TIME} />
        </div>
      </div>
    </TooltipProvider>
  )
}
