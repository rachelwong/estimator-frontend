import { CellState, GridMode } from '@/constants'
import type { CellState as CellStateValue, GridMode as GridModeValue, RevealPayload } from '@/types'

// Interactive: green only for your own Selection. Readonly: green wherever
// anyone landed.
export function cellState(mode: GridModeValue, isMine: boolean, names: string[]): CellStateValue {
  const isChosen = mode === GridMode.INTERACTIVE ? isMine : names.length > 0

  return isChosen ? CellState.CHOSEN : CellState.EMPTY
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
