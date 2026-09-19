import { CellState, GridMode } from '@/constants'
import type {
  CellState as CellStateValue,
  GridMode as GridModeValue,
  RevealPayload,
  Selection,
} from '@/types'

// Interactive: green for your own Selection, grey fill across its Area.
// Readonly: green wherever anyone landed, no Areas.
export function cellState(
  mode: GridModeValue,
  square: Selection,
  selection: Selection | null,
  names: string[],
): CellStateValue {
  if (mode === GridMode.READONLY) {
    return names.length > 0 ? CellState.CHOSEN : CellState.EMPTY
  }

  if (!selection) {
    return CellState.EMPTY
  }

  if (isSameSquare(square, selection)) {
    return CellState.CHOSEN
  }

  return inArea(square, selection) ? CellState.AREA : CellState.EMPTY
}

// Everything from the origin up to and including the corner. Axis values,
// not indices: Fibonacci (3, 2) covers Time 0 1 2 3 × Resources 0 1 2.
export function inArea(square: Selection, corner: Selection): boolean {
  return square.time <= corner.time && square.resource <= corner.resource
}

export function isSameSquare(a: Selection, b: Selection): boolean {
  return a.time === b.time && a.resource === b.resource
}

export function groupNames(reveal?: RevealPayload): Map<string, string[]> {
  const entries = reveal?.squares.map((square) => {
    return [squareKey(square.time, square.resource), square.names] as const
  })

  return new Map(entries ?? [])
}

export function squareKey(time: number, resource: number): string {
  return `${time}:${resource}`
}
