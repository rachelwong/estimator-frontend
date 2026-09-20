import type { HoverSource } from './constants'
import type { Selection } from './protocol'

// The Square under the mouse or keyboard focus, and which of the two put it
// there — only the mouse previews an Area.
export interface HoveredSquare {
  square: Selection
  source: HoverSource
}
