import { InfoIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { AXIS_TITLE_CLASS, AxisOrientation } from '@/constants'
import { cn } from '@/lib/utils'
import type { AxisOrientation as AxisOrientationValue } from '@/types'

interface AxisTitleProps {
  label: string
  hint: string
  orientation?: AxisOrientationValue
}

// A button so the hint is reachable by keyboard. Decision #18 covers Squares only.
export function AxisTitle({
  label,
  hint,
  orientation = AxisOrientation.HORIZONTAL,
}: AxisTitleProps) {
  const classes = AXIS_TITLE_CLASS[orientation]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex cursor-help items-center gap-1 place-self-center text-sm font-medium',
            classes.trigger,
          )}
        >
          {label}
          <InfoIcon className={cn('size-3.5 text-muted-foreground', classes.icon)} />
        </button>
      </TooltipTrigger>
      <TooltipContent>{hint}</TooltipContent>
    </Tooltip>
  )
}
