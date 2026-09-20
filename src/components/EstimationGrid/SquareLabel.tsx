import { CROWDED_SQUARE_MINIMUM } from '@/constants'

interface SquareLabelProps {
  names: string[]
}

// What a revealed Square says on its face. One person's Square carries their
// name, on the fill that is already their colour. A crowded one carries the
// count instead — three names in a 28px Square is unreadable at any size the
// grid actually gets — and clicking it opens the badges. Empty Squares, and
// every Square of a running Session, say nothing.
export function SquareLabel({ names }: SquareLabelProps) {
  if (names.length === 0) {
    return null
  }

  const label = names.length < CROWDED_SQUARE_MINIMUM ? names[0] : `${names.length} votes`

  return <span className="max-w-full truncate px-0.5 text-xs leading-tight">{label}</span>
}
