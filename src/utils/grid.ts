import {
  CellState,
  CROWDED_SQUARE_BORDER_CLASS,
  CROWDED_SQUARE_CLASS,
  CROWDED_SQUARE_MINIMUM,
  GridMode,
} from '@/constants'
import type {
  CellState as CellStateValue,
  GridMode as GridModeValue,
  ParticipantColours,
  RevealPayload,
  Selection,
} from '@/types'

// Interactive: green for your own Selection, grey fill across its Area.
// Readonly: a revealed Square wherever anyone landed, no Areas. Who landed
// there is carried by the Square's own colour.
export function cellState(
  mode: GridModeValue,
  square: Selection,
  selection: Selection | null,
  names: string[],
): CellStateValue {
  if (mode === GridMode.READONLY) {
    return names.length > 0 ? CellState.REVEALED : CellState.EMPTY
  }

  if (!selection) {
    return CellState.EMPTY
  }

  if (isSameSquare(square, selection)) {
    return CellState.CHOSEN
  }

  return inArea(square, selection) ? CellState.AREA : CellState.EMPTY
}

// How a revealed Square is filled: one person's Square is theirs entirely, in
// their own colour; a crowded one goes grey — deeper the more people chose it
// — and picks up the rolling rainbow border. Readonly only; nothing fills a
// Square while the Session runs.
export function revealedSquareClass(
  names: string[],
  colours: ParticipantColours,
): string | undefined {
  if (names.length < CROWDED_SQUARE_MINIMUM) {
    return colours.get(names[0])
  }

  const grey =
    CROWDED_SQUARE_CLASS[
      Math.min(names.length - CROWDED_SQUARE_MINIMUM, CROWDED_SQUARE_CLASS.length - 1)
    ]

  return `${grey} ${CROWDED_SQUARE_BORDER_CLASS}`
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
