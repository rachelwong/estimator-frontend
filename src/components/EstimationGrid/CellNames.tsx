import { MAX_VISIBLE_NAMES } from '@/constants'

interface CellNamesProps {
  names: string[]
}

// Names stack vertically, capped: ["A", "B", "C", "D", "E"] → A, B, C, +2 more.
export function CellNames({ names }: CellNamesProps) {
  if (names.length === 0) {
    return null
  }

  const hiddenCount = names.length - MAX_VISIBLE_NAMES

  return (
    <div className="flex min-w-0 flex-col items-center text-xs leading-tight">
      {names.slice(0, MAX_VISIBLE_NAMES).map((name) => (
        <span key={name} className="max-w-full truncate">
          {name}
        </span>
      ))}
      {hiddenCount > 0 && <span className="opacity-80">+{hiddenCount} more</span>}
    </div>
  )
}
