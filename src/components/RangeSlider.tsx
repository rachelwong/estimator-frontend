import type { KeyboardEvent } from 'react'
import { Slider } from '@/components/ui/slider'
import { SLIDER_STEP_DIRECTION } from '@/constants'
import type { PointSystemType } from '@/types'
import { nearestValue, pointSystemValues, stepValue } from '@/utils'

interface RangeSliderProps {
  pointSystemType: PointSystemType
  value: number
  onChange: (value: number) => void
}

// The thumb rests only on values the grid can actually use, placed by their
// magnitude — so Fibonacci's gaps widen the way the sequence does:
//
//   0 1 2 3  5   8      13         21              34                        55
//   ●┼┼┼─┼───┼──────┼──────────┼──────────────┼──────────────────────────────┼
//
// Numerical runs through the same path; every integer up to its maximum is a
// value, so nothing is snapped away.
//
// Which values those are depends on the point system, so the two controls are
// co-dependent. Resetting the value on a switch is the caller's job — this
// component only renders what it is given.
export function RangeSlider({ pointSystemType, value, onChange }: RangeSliderProps) {
  const values = pointSystemValues(pointSystemType)
  const max = values[values.length - 1]

  // Captured, so these keys never reach the Slider: its own step would land
  // between values, and snapping back would leave the thumb stuck. Home and End
  // still go through — both ends of the track are values.
  function handleKeyDown(event: KeyboardEvent) {
    const direction = SLIDER_STEP_DIRECTION[event.key as keyof typeof SLIDER_STEP_DIRECTION]

    if (direction === undefined) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    onChange(stepValue(values, value, direction))
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm">What is the maximum point value?</span>
        <span className="text-sm font-medium tabular-nums">{value}</span>
      </div>

      <Slider
        name="sliderMax"
        min={0}
        max={max}
        step={1}
        value={[value]}
        onValueChange={([next]) => onChange(nearestValue(values, next))}
        onKeyDownCapture={handleKeyDown}
      />

      <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
        <span>0</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
