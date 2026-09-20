import { cn } from '@/lib/utils'
import type { ParticipantColours } from '@/types'

interface ParticipantLegendProps {
  colours: ParticipantColours
}

// Who owns which colour, so a Square can be read without hovering it. The map
// is already in name order, and its swatches deliberately avoid aspect-square —
// scripts/smoke/lib.mjs picks the grid's own Squares out by that class.
export function ParticipantLegend({ colours }: ParticipantLegendProps) {
  if (colours.size === 0) {
    return null
  }

  return (
    <section className="grid gap-2">
      <h3 className="text-sm font-medium">Who is who</h3>

      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {[...colours].map(([name, colour]) => (
          <li key={name} className="flex items-center gap-2 text-sm">
            <span className={cn('size-3 shrink-0 rounded-sm', colour)} />
            {name}
          </li>
        ))}
      </ul>
    </section>
  )
}
