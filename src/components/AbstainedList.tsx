import { Badge } from '@/components/ui/badge'

interface AbstainedListProps {
  names: string[]
}

// Joined but held no Selection at the end — left early or chose nothing.
export function AbstainedList({ names }: AbstainedListProps) {
  return (
    <section className="grid gap-2">
      <h3 className="text-sm font-medium">Abstained</h3>

      {names.length === 0 && <p className="text-sm text-muted-foreground">Nobody.</p>}

      <div className="flex flex-wrap gap-2">
        {names.map((name) => (
          <Badge key={name} variant="outline">
            {name}
          </Badge>
        ))}
      </div>
    </section>
  )
}
