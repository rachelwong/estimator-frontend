// DEV ONLY — TEMPORARY. Fixtures for /dev/primitives, deleted with the sheet.
//
// DEV_ names, so anything that leaks into a real screen reads as a mistake at
// the call site rather than looking like production data.

import { ChipSize, ChipVariant } from '@/constants'
import type { ChipSize as ChipSizeType, ChipVariant as ChipVariantType } from '@/types'

interface DevChip {
  label: string
  variant: ChipVariantType
  size: ChipSizeType
  className?: string
}

// Every shape a chip takes across the design: the two title-bar labels, the
// live session's `copied` fill, a name from "who landed where", and the dashed
// Abstained chip.
export const DEV_CHIPS: DevChip[] = [
  { label: 'Admin', variant: ChipVariant.SOLID, size: ChipSize.LABEL },
  { label: 'Participant', variant: ChipVariant.SOLID, size: ChipSize.LABEL },
  { label: 'live', variant: ChipVariant.SOLID, size: ChipSize.LABEL, className: 'bg-copied' },
  { label: 'error', variant: ChipVariant.SOLID, size: ChipSize.LABEL },
  { label: 'Mia', variant: ChipVariant.SOLID, size: ChipSize.NAME },
  { label: 'Jim-2', variant: ChipVariant.DASHED, size: ChipSize.NAME },
]

interface DevWindow {
  title: string
  chip?: string
  widthClass: string
  body: string
}

// The four widths §5 gives, at the screen each belongs to. The sheet renders
// them stacked, so a narrow viewport shows every one of them shrinking to fit.
export const DEV_WINDOWS: DevWindow[] = [
  {
    title: 'live',
    chip: 'Participant',
    widthClass: 'w-full desktop:w-[780px]',
    body: 'Active and Reveal: 780 desktop · 740 tablet · 366 mobile.',
  },
  {
    title: 'new-session',
    chip: 'Admin',
    widthClass: 'w-full desktop:w-[640px]',
    body: 'Create: 640 · 600 · 366.',
  },
  {
    title: 'join',
    chip: 'Participant',
    widthClass: 'w-full desktop:w-[560px]',
    body: 'Join: 560 · 560 · 366.',
  },
  {
    title: 'session not found',
    chip: 'error',
    widthClass: 'w-full desktop:w-[900px]',
    body: 'Error: 900 · 740 · 366.',
  },
]

interface DevCard {
  title: string
  body: string
  tintClass: string
}

// A Card wears a tint on the Welcome page (§2) — the four How to play fills.
// The point here is that the 3px edge and 6px shadow hold over any fill.
export const DEV_CARDS: DevCard[] = [
  { title: 'LV.1', body: 'White — the default fill.', tintClass: 'bg-white' },
  { title: 'LV.2', body: 'The butter card tint.', tintClass: 'bg-butter' },
  { title: 'LV.3', body: 'The copied green.', tintClass: 'bg-copied' },
  { title: 'LV.4', body: 'The idle Square.', tintClass: 'bg-crowd-0' },
]
