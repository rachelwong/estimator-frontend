import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { POINT_SYSTEM_OPTIONS } from '@/constants'
import type { PointSystemType as PointSystemTypeValue } from '@/types'

interface PointSystemPickerProps {
  value: PointSystemTypeValue
  onChange: (value: PointSystemTypeValue) => void
}

export function PointSystemPicker({ value, onChange }: PointSystemPickerProps) {
  return (
    <RadioGroup
      name="pointSystemType"
      value={value}
      onValueChange={(next) => onChange(next as PointSystemTypeValue)}
      className="gap-3"
    >
      {POINT_SYSTEM_OPTIONS.map((option) => (
        <div key={option.value} className="flex items-center gap-2">
          <RadioGroupItem value={option.value} id={`point-system-${option.value}`} />
          <label htmlFor={`point-system-${option.value}`} className="text-sm">
            {option.label}
          </label>
        </div>
      ))}
    </RadioGroup>
  )
}
