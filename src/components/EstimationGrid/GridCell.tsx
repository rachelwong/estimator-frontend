import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CELL_CLASS } from '@/constants'
import { cn } from '@/lib/utils'
import type { CellState } from '@/types'
import { CellNames } from './CellNames'

interface GridCellProps {
  state: CellState
  names: string[]
  onClick?: () => void
}

// Clickable only in interactive mode. No keyboard navigation (decision #18).
export function GridCell({ state, names, onClick }: GridCellProps) {
  const className = cn(
    'flex aspect-square items-center justify-center overflow-hidden rounded-sm p-1',
    CELL_CLASS[state],
  )

  if (onClick) {
    return (
      <button type="button" className={cn(className, 'cursor-pointer')} onClick={onClick}>
        <CellNames names={names} />
      </button>
    )
  }

  const cell = (
    <div className={className}>
      <CellNames names={names} />
    </div>
  )

  if (names.length === 0) {
    return cell
  }

  // Full list on hover — the cell itself caps at MAX_VISIBLE_NAMES and
  // truncates long names.
  return (
    <Tooltip>
      <TooltipTrigger asChild>{cell}</TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col">
          {names.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
