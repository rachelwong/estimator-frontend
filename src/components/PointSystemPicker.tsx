import { useId } from 'react'
import { PointSystemType } from '@/constants'
import { useContent } from '@/hooks'
import { cn } from '@/lib/utils'
import type { PointSystemType as PointSystemTypeValue } from '@/types'

interface PointSystemPickerProps {
  value: PointSystemTypeValue
  onChange: (value: PointSystemTypeValue) => void
}

// Two-up segmented buttons (DESIGN.md §7): the pressed one fills `option-selected` and
// stands on a 4px shadow, the other sits flat in white. The swap is instant:
// a faded fill would flash white text on a pale button. Hover only dims, and
// that eases in, like every Button's. Toggle buttons with
// `aria-pressed` in a labelled group, as the artboard marks them up — two
// options both worth seeing at once.
//
// The buttons are type="button" so they never submit; the hidden input is
// what the form sends.
export function PointSystemPicker({ value, onChange }: PointSystemPickerProps) {
  const labelId = useId()
  const content = useContent()

  return (
    <div className="flex flex-col gap-2">
      <span id={labelId} className="text-[15px] font-extrabold work:text-[14px] work:leading-5 work:font-medium">
        {content.create.pointSystemLabel}
      </span>

      <div role="group" aria-labelledby={labelId} className="grid grid-cols-2 gap-3.5 work:gap-2">
        {Object.values(PointSystemType).map((type) => (
          <button
            key={type}
            type="button"
            aria-pressed={type === value}
            onClick={() => onChange(type)}
            className={cn(
              'h-13 cursor-pointer rounded-control border-[3px] border-border transition-[filter,background-color] hover:brightness-95 font-body text-[16px] font-extrabold outline-none focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ring work:h-12 work:border work:text-[15px] work:font-medium work:hover:brightness-100 work:focus-visible:outline-2 work:focus-visible:outline-offset-2',
              type === value
                ? 'bg-option-selected text-option-selected-foreground border-option-selected-border shadow-control'
                : 'bg-input text-foreground work:hover:bg-row-hover',
            )}
          >
            {content.create.pointSystemName[type]}
          </button>
        ))}
      </div>

      <input type="hidden" name="pointSystemType" value={value} />
    </div>
  )
}
