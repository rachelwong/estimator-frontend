import type { HoverSource } from './constants'
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

// What wears the Reveal's change flash right now, each mapped to a flash id: the
// Squares by squareKey, and the people who moved by name.
export interface ChangeFlashes {
  squares: ReadonlyMap<string, number>
  names: ReadonlyMap<string, number>
}
