import { AXIS_VALUE_EMPHASIS_CLASS, AxisValueEmphasis } from '@/constants'
import { cn } from '@/lib/utils'
import type { AxisValueEmphasis as AxisValueEmphasisValue } from '@/types'

interface AxisValueProps {
  value: number
  emphasis?: AxisValueEmphasisValue
}

export function AxisValue({ value, emphasis = AxisValueEmphasis.NONE }: AxisValueProps) {
  return (
    <span
      className={cn(
        'flex items-center font-label text-[11px] tabular-nums',
        AXIS_VALUE_EMPHASIS_CLASS[emphasis],
      )}
    >
      {value}
    </span>
  )
}
