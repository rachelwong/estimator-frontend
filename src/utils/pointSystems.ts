import {
  FIBONACCI_SEQUENCE,
  NUMERICAL_MAX,
  PointSystemType,
  SLIDER_TICK_EVERY,
} from '@/constants'
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

// The slider positions that carry a tick label, as indexes into `values`.
// Always includes both ends.
export function sliderTickIndexes(type: PointSystemTypeValue, count: number): number[] {
  const every = SLIDER_TICK_EVERY[type]

  return Array.from({ length: count }, (_, index) => index).filter(
    (index) => index % every === 0 || index === count - 1,
  )
}
