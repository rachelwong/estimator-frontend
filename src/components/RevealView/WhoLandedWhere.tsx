import { Chip } from '@/components/Chip'
import { ChipSize, ChipVariant } from '@/constants'
import type { HoveredSquare, HoverSource, LandedPerson, Selection } from '@/types'
import { isSameSquare, nextPinned } from '@/utils'
import { LandedChip } from './LandedChip'

interface WhoLandedWhereProps {
  people: LandedPerson[]
  abstained: string[]
  hovered: HoveredSquare | null
  onHoveredChange: (hovered: HoveredSquare | null) => void
  pinned: Selection | null
  onPinnedChange: (pinned: Selection | null) => void
}

// Everyone in the Reveal as a row of chips (§6): names only, since the grid
// already says where. Abstained follow in dashed chips — joined, but held no
// Selection at the end, whether they left early or chose nothing.
export function WhoLandedWhere({
  people,
  abstained,
  hovered,
  onHoveredChange,
  pinned,
  onPinnedChange,
}: WhoLandedWhereProps) {
  // Ends only the preview this chip started: a Square the mouse has since
  // moved onto keeps its own.
  function endPreview(source: HoverSource) {
    if (hovered?.source === source) {
      onHoveredChange(null)
    }
  }

  return (
    <section className="flex flex-col gap-2.5 border-t-2 border-dashed border-ink pt-3.5">
      <h3 className="font-label text-[11px] font-normal">who landed where</h3>

      <ul className="flex flex-wrap gap-2">
        {people.map(({ name, square }) => (
          <li key={name}>
            <LandedChip
              name={name}
              expanded={Boolean(pinned && isSameSquare(pinned, square))}
              onPreview={(source) => onHoveredChange({ square, source })}
              onPreviewEnd={endPreview}
              onClick={() => onPinnedChange(nextPinned(pinned, square, [name]))}
            />
          </li>
        ))}

        {abstained.map((name) => (
          <li key={name}>
            <Chip variant={ChipVariant.DASHED} size={ChipSize.NAME}>
              <span className="max-w-[120px] truncate">{name}</span>
              <span className="font-label text-[10px] font-normal text-abstained">Abstained</span>
            </Chip>
          </li>
        ))}
      </ul>
    </section>
  )
}
