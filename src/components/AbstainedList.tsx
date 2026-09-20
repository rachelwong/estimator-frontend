import { Chip } from '@/components/Chip'
import { ChipSize, ChipVariant } from '@/constants'

interface AbstainedListProps {
  names: string[]
}

// Joined but held no Selection at the end — left early or chose nothing. The
// dashed chip is the design's word for that absence (DESIGN.md §4).
export function AbstainedList({ names }: AbstainedListProps) {
  return (
    <section className="grid gap-2">
      <h3 className="text-sm font-medium">Abstained</h3>

      {names.length === 0 && <p className="text-sm text-muted-foreground">Nobody.</p>}

      <div className="flex flex-wrap gap-2">
        {names.map((name) => (
          <Chip key={name} variant={ChipVariant.DASHED} size={ChipSize.NAME}>
            {name}
          </Chip>
        ))}
      </div>
    </section>
  )
}
