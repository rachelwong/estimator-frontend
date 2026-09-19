import { Fragment } from 'react'
import { GridMode } from '@/constants'
import type { GridMode as GridModeValue, RevealPayload, Selection } from '@/types'
import { cellState, groupNames, squareKey } from '@/utils'
import { AxisValue } from './AxisValue'
import { GridCell } from './GridCell'

interface EstimationGridProps {
  axisValues: number[]
  mode: GridModeValue
  selection?: Selection | null
  reveal?: RevealPayload
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
  onSelect,
}: EstimationGridProps) {
  const rows = [...axisValues].reverse()
  const cols = axisValues
  const namesBySquare = groupNames(reveal)

  // Leading auto column holds the Resources values.
  const gridStyle = {
    gridTemplateColumns: `auto repeat(${cols.length}, minmax(0, 1fr))`,
  }

  return (
    <div className="flex items-center gap-3">
      <span className="rotate-180 text-sm font-medium [writing-mode:vertical-rl]">
        Resources
      </span>

      <div className="grid flex-1 gap-2">
        <div className="grid gap-1" style={gridStyle}>
          {rows.map((resource) => (
            <Fragment key={resource}>
              <AxisValue value={resource} />

              {cols.map((time) => {
                const names = namesBySquare.get(squareKey(time, resource)) ?? []
                const isMine = selection?.time === time && selection?.resource === resource
                const handleClick =
                  mode === GridMode.INTERACTIVE
                    ? () => onSelect?.({ time, resource })
                    : undefined

                return (
                  <GridCell
                    key={time}
                    state={cellState(mode, isMine, names)}
                    names={names}
                    onClick={handleClick}
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

        <span className="text-center text-sm font-medium">Time</span>
      </div>
    </div>
  )
}
