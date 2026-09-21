import type { Breakpoint, HoverSource } from './constants'
import type { Selection } from './protocol'

// The Square under the mouse or keyboard focus, and which of the two put it
// there — only the mouse previews an Area.
export interface HoveredSquare {
  square: Selection
  source: HoverSource
}

// One chip in the Reveal's "who landed where": a name and the Square it
// previews and pins.
export interface LandedPerson {
  name: string
  square: Selection
}

// How big a grid's Squares may get at each artboard (§5): the width budget
// they share, and the size they stop growing at.
export type SquareFit = Record<Breakpoint, { available: number; max: number }>
