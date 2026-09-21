import type { CSSProperties } from 'react'
import {
  BROKEN_GRID_FALLEN,
  BROKEN_GRID_HEIGHT_PITCHES,
  BROKEN_GRID_STANDING,
  CROWD_CLASS,
  SQUARE_GAP_PX,
} from '@/constants'
import { cn } from '@/lib/utils'

// The error screens' illustration (DESIGN.md §7): a 5×5 grid of Squares with
// five fallen out. They lie tilted beneath it wearing the hover lift's shadow,
// and dashed outlines mark where they stood.
//
// Squares are 30 / 44 / 50px. Everything is placed in multiples of one pitch —
// a Square plus the grid's gap — so the breakpoints only change --square, and
// the gap stays 4px at every size, as it is on the real grid.
//
// Decorative only: nothing here is a real Square, so none of it is announced.
export function BrokenGrid() {
  const columns = BROKEN_GRID_STANDING[0].length

  return (
    <div
      aria-hidden="true"
      className="relative shrink-0 [--square:30px] tablet:[--square:44px] desktop:[--square:50px]"
      style={
        {
          '--pitch': `calc(var(--square) + ${SQUARE_GAP_PX}px)`,
          width: `calc(var(--pitch) * ${columns} - ${SQUARE_GAP_PX}px)`,
          height: `calc(var(--pitch) * ${BROKEN_GRID_HEIGHT_PITCHES})`,
        } as CSSProperties
      }
    >
      {BROKEN_GRID_STANDING.map((cells, row) =>
        cells.map((crowdStep, column) => (
          <div
            key={`${row}-${column}`}
            className={cn(
              'absolute size-(--square) border-2',
              crowdStep === null
                ? 'border-dashed border-text-subtle'
                : cn('border-ink', CROWD_CLASS[crowdStep]),
            )}
            style={{
              left: `calc(var(--pitch) * ${column})`,
              top: `calc(var(--pitch) * ${row})`,
            }}
          />
        )),
      )}

      {BROKEN_GRID_FALLEN.map(({ column, row, rotationDegrees, fillClass }) => (
        <div
          key={`${column}-${row}`}
          className={cn('absolute size-(--square) border-2 border-ink shadow-px', fillClass)}
          style={{
            left: `calc(var(--pitch) * ${column})`,
            top: `calc(var(--pitch) * ${row})`,
            transform: `rotate(${rotationDegrees}deg)`,
          }}
        />
      ))}
    </div>
  )
}

