import { FIBONACCI_SEQUENCE, NUMERICAL_MAX, PointSystemType } from '@/constants'
import type { PointSystemType as PointSystemTypeValue } from '@/types'

// The maxima the slider may rest on. Ascending, and the same list the server
// builds the axes from — mirrors computeAxisValues in
// estimator-backend/src/pointSystems.ts.
export function pointSystemValues(type: PointSystemTypeValue): readonly number[] {
  if (type === PointSystemType.FIBONACCI) {
    return FIBONACCI_SEQUENCE
  }

  return Array.from({ length: NUMERICAL_MAX + 1 }, (_, index) => index)
}

// Where a slider position lands. Nearest and nothing else, so it is monotonic:
// a pointer moving right can never send the thumb back, which anything
// direction-aware would do around every midpoint.
export function nearestValue(values: readonly number[], target: number): number {
  return values.reduce((best, value) => {
    return Math.abs(value - target) < Math.abs(best - target) ? value : best
  })
}

// One value along, clamped at the ends. What an arrow key moves by — the gaps
// are too wide for the slider's own step of 1 to cross.
export function stepValue(
  values: readonly number[],
  current: number,
  direction: number,
): number {
  const next = values.indexOf(current) + direction

  return values[Math.min(Math.max(next, 0), values.length - 1)]
}
