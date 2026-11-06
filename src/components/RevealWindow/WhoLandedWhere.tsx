import { Chip } from "@/components/Chip";
import { ChipSize, ChipVariant } from "@/constants";
import { useContent } from "@/hooks";
import type {
  HoveredSquare,
  HoverSource,
  LandedPerson,
  Selection,
} from "@/types";
import { isSameSquare, nextPinned } from "@/utils";
import type { ElementType } from "react";
import { LandedChip } from "./LandedChip";

interface WhoLandedWhereProps {
  /** One level under the window's own heading. */
  heading: ElementType;
  people: LandedPerson[];
  abstained: string[];
  hovered: HoveredSquare | null;
  onHoveredChange: (hovered: HoveredSquare | null) => void;
  pinned: Selection | null;
  onPinnedChange: (pinned: Selection | null) => void;
  /** People who just moved, as name → flash id (§7). */
  flashes?: ReadonlyMap<string, number>;
}

// Everyone in the Reveal as a row of chips (§6): names only, since the grid
// already says where. Abstained follow in dashed chips — joined, but held no
// Selection at the end, whether they left early or chose nothing. They tint on
// hover like the rest, but take no focus: there is no Square to show.
export function WhoLandedWhere({
  heading: Heading,
  people,
  abstained,
  hovered,
  onHoveredChange,
  pinned,
  onPinnedChange,
  flashes,
}: WhoLandedWhereProps) {
  const content = useContent();

  // Ends only the preview this chip started: a Square the mouse has since
  // moved onto keeps its own.
  function endPreview(source: HoverSource) {
    if (hovered?.source === source) {
      onHoveredChange(null);
    }
  }

  return (
    <section className="flex flex-col gap-2.5 border-t-2 border-dashed border-border-subtle pt-3.5">
      <Heading className="font-label text-[11px] font-normal">
        {content.reveal.teamHeading}
      </Heading>

      <ul className="flex flex-wrap gap-2">
        {people.map(({ name, square }) => (
          <li key={name}>
            <LandedChip
              name={name}
              expanded={Boolean(pinned && isSameSquare(pinned, square))}
              flashId={flashes?.get(name)}
              onPreview={(source) => onHoveredChange({ square, source })}
              onPreviewEnd={endPreview}
              onClick={() => onPinnedChange(nextPinned(pinned, square, [name]))}
            />
          </li>
        ))}

        {abstained.map((name) => (
          <li key={name}>
            <Chip
              variant={ChipVariant.DASHED}
              size={ChipSize.NAME}
              className="transition-colors duration-[120ms] hover:bg-row-hover"
            >
              <span className="max-w-[120px] truncate">{name}</span>
              <span className="font-label text-[10px] font-normal text-abstained">
                {content.reveal.abstained}
              </span>
            </Chip>
          </li>
        ))}
      </ul>
    </section>
  );
}
