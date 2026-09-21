import {
  AxisValueEmphasis,
  CROWD_CLASS,
  CROWDED_SQUARE_MINIMUM,
  GridMode,
  HoverSource,
  REVEAL_WAVE_STEP_MS,
  SELECTION_AREA_CROWD_STEP,
  SELECTION_LABEL,
  SELECTION_SQUARE_CLASS,
  SQUARE_FIT,
  SQUARE_FULL_LABEL_MIN_PX,
  SQUARE_GAP_PX,
  SQUARE_INITIALS_LENGTH,
  SQUARE_MIN_PX,
  SQUARE_NAME_MAX_CHARS,
  SquareHighlight,
  SquareLabelSize,
  TOOLTIP_NAME_MAX_CHARS,
  YOUR_SQUARE_CLASS,
} from '@/constants'
import type {
  AxisValueEmphasis as AxisValueEmphasisValue,
  Breakpoint,
  GridMode as GridModeValue,
  HoveredSquare,
  LandedPerson,
  RevealPayload,
  Selection,
  SquareHighlight as SquareHighlightValue,
  SquareLabelSize as SquareLabelSizeValue,
} from '@/types'

// Interactive: `selection` yellow for your own Selection, crowd-1 across its
// Area. Readonly: the crowd ramp by headcount, no Areas, and a ring on the
// Square you held when it ended.
export function squareFillClass(
  mode: GridModeValue,
  square: Selection,
  selection: Selection | null,
  names: string[],
): string {
  if (mode === GridMode.READONLY) {
    const crowd = CROWD_CLASS[Math.min(names.length, CROWD_CLASS.length - 1)]
    return selection && isSameSquare(square, selection) ? `${crowd} ${YOUR_SQUARE_CLASS}` : crowd
  }

  if (!selection) {
    return CROWD_CLASS[0]
  }

  if (isSameSquare(square, selection)) {
    return SELECTION_SQUARE_CLASS
  }

  return inArea(square, selection) ? CROWD_CLASS[SELECTION_AREA_CROWD_STEP] : CROWD_CLASS[0]
}

// §5, floored at SQUARE_MIN_PX. Fibonacci's 7×7 gives 70 / 64 / 39.
export function squareSize(count: number, breakpoint: Breakpoint): number {
  const { available, max } = SQUARE_FIT[breakpoint]
  const fitted = Math.floor((available - (count - 1) * SQUARE_GAP_PX) / count)

  return Math.max(SQUARE_MIN_PX, Math.min(max, fitted))
}

export function labelSize(size: number): SquareLabelSizeValue {
  return size >= SQUARE_FULL_LABEL_MIN_PX ? SquareLabelSize.FULL : SquareLabelSize.COMPACT
}

// A Square's face (§6). Running: "You" / "★" on your Selection, else blank.
// Revealed, by headcount and room:
//
//   people   full        compact
//   0        —           —
//   1        Barthol…    Ba
//   3        3⏎people    ×3
export function squareLabel(
  mode: GridModeValue,
  square: Selection,
  selection: Selection | null,
  names: string[],
  size: SquareLabelSizeValue,
): string {
  if (mode === GridMode.INTERACTIVE) {
    return selection && isSameSquare(square, selection) ? SELECTION_LABEL[size] : ''
  }

  if (names.length === 0) {
    return ''
  }

  const isFull = size === SquareLabelSize.FULL

  if (names.length < CROWDED_SQUARE_MINIMUM) {
    return isFull ? truncate(names[0], SQUARE_NAME_MAX_CHARS) : names[0].slice(0, SQUARE_INITIALS_LENGTH)
  }

  return isFull ? `${names.length}\npeople` : `×${names.length}`
}

// "Time 5, resources 3", then who is there in the Reveal, then whether it is
// your Selection — the one you hold, or in the Reveal the one you held.
export function squareAriaLabel(
  mode: GridModeValue,
  square: Selection,
  selection: Selection | null,
  names: string[],
): string {
  const position = `Time ${square.time}, resources ${square.resource}`
  const who = mode === GridMode.READONLY ? `, ${names.length > 0 ? names.join(', ') : 'nobody'}` : ''
  const yours = selection && isSameSquare(square, selection) ? ', your Selection' : ''

  return `${position}${who}${yours}`
}

// When a revealed Square starts arriving (§8): one step per diagonal from the
// origin, so the wave runs bottom-left to top-right.
export function revealDelay(axisValues: number[], square: Selection): number {
  return (axisValues.indexOf(square.time) + axisValues.indexOf(square.resource)) * REVEAL_WAVE_STEP_MS
}

// Everyone with a Square, in the order the Reveal lists them — the chips in
// "who landed where" (§6).
export function landedPeople(reveal?: RevealPayload): LandedPerson[] {
  return (reveal?.squares ?? []).flatMap(({ time, resource, names }) =>
    names.map((name) => ({ name, square: { time, resource } })),
  )
}

// Running: "Time 5 · Resources 3". Revealed: "T5 · R3 · Mia", or a count and a
// pointer to the popover once there's a crowd.
export function tooltipText(mode: GridModeValue, square: Selection, names: string[]): string {
  if (mode === GridMode.INTERACTIVE) {
    return popoverTitle(square)
  }

  const position = `T${square.time} · R${square.resource}`

  if (names.length === 0) {
    return `${position} · nobody`
  }

  if (names.length < CROWDED_SQUARE_MINIMUM) {
    return `${position} · ${truncate(names[0], TOOLTIP_NAME_MAX_CHARS)}`
  }

  return `${position} · ${names.length} people · click for names`
}

export function popoverTitle(square: Selection): string {
  return `Time ${square.time} · Resources ${square.resource}`
}

// Cut to `max` characters, the ellipsis counted: ("Bartholomew", 8) → "Barthol…".
function truncate(name: string, max: number): string {
  return name.length > max ? `${name.slice(0, max - 1)}…` : name
}

// Lifted (hovered, focused or pinned) beats the Area preview; the preview is
// the running grid's, and the mouse's only.
export function squareHighlight(
  mode: GridModeValue,
  square: Selection,
  hovered: HoveredSquare | null,
  pinned: Selection | null,
): SquareHighlightValue {
  const isHovered = hovered && isSameSquare(hovered.square, square)
  const isPinned = pinned && isSameSquare(pinned, square)

  if (isHovered || isPinned) {
    return SquareHighlight.LIFTED
  }

  const isPreviewing = mode === GridMode.INTERACTIVE && hovered?.source === HoverSource.POINTER
  return isPreviewing && inArea(square, hovered.square) ? SquareHighlight.AREA_PREVIEW : SquareHighlight.NONE
}

// An axis value lights up while the hovered Square sits in its row or column.
export function axisEmphasis(value: number, hoveredValue: number | undefined): AxisValueEmphasisValue {
  return value === hoveredValue ? AxisValueEmphasis.ACTIVE : AxisValueEmphasis.NONE
}

// Clicking a revealed Square pins its popover, or unpins it if it's already
// open. A Square nobody landed on has nothing to show, so it just unpins.
export function nextPinned(
  pinned: Selection | null,
  square: Selection,
  names: string[],
): Selection | null {
  const isOpen = pinned && isSameSquare(pinned, square)

  return names.length > 0 && !isOpen ? square : null
}

// The CSS selector GridCell's data-square answers to.
export function squareSelector(square: Selection): string {
  return `[data-square="${squareKey(square.time, square.resource)}"]`
}

// One arrow-key step from `square`, held at the grid's edge. Steps are in axis
// indexes, not values: from Fibonacci 5, → lands on 8.
export function stepSquare(
  axisValues: number[],
  square: Selection,
  step: { time: number; resource: number },
): Selection {
  const last = axisValues.length - 1
  const move = (value: number, by: number) =>
    axisValues[Math.max(0, Math.min(last, axisValues.indexOf(value) + by))]

  return { time: move(square.time, step.time), resource: move(square.resource, step.resource) }
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
