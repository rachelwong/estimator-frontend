import type { RevealPayload } from '@/types'

// DEV ONLY — TEMPORARY. Not production values: fake data for GridPreviewPage,
// checking EstimationGrid against the Miro screens before live data exists.
// Deleted with the rest of src/routes/dev/GridPreviewPage/ in Phase 12.
export const DEV_AXIS_VALUES = [0, 1, 2, 3, 5, 8]

export const DEV_REVEAL: RevealPayload = {
  squares: [
    { time: 2, resource: 5, names: ['James'] },
    { time: 2, resource: 2, names: ['Mary'] },
    { time: 8, resource: 2, names: ['John', 'Jim'] },
    { time: 5, resource: 8, names: ['Ann', 'Bob', 'Cat', 'Dan', 'Eve'] },
  ],
  abstained: ['Henry'],
}
