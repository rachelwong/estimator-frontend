import { Slider } from '@/components/ui/slider'
import { SLIDER_MAX_CEILING } from '@/constants'
import type { PointSystemType } from '@/types/constants'

interface RangeSliderProps {
  pointSystemType: PointSystemType
  value: number
  onChange: (value: number) => void
}

// The ceiling depends on the point system, so the two controls are
// co-dependent. Resetting the value on a switch is the caller's job — this
// component only renders what it is given.
export function RangeSlider({ pointSystemType, value, onChange }: RangeSliderProps) {
  const ceiling = SLIDER_MAX_CEILING[pointSystemType]

  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm">What is the maximum point value?</span>
        <span className="text-sm font-medium tabular-nums">{value}</span>
      </div>

      <Slider
        name="sliderMax"
        min={0}
        max={ceiling}
        step={1}
        value={[value]}
        onValueChange={([next]) => onChange(next)}
      />

      <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
        <span>0</span>
        <span>{ceiling}</span>
      </div>
    </div>
  )
}
