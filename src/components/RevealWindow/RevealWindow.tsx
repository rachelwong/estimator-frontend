import { EstimationGrid } from "@/components/EstimationGrid";
import { SessionDescription } from "@/components/SessionDescription";
import { Window } from "@/components/Window";
import { GridMode, WindowVariant } from "@/constants";
import { useContent } from "@/hooks";
import type { ChangeFlashes, HoveredSquare, RevealPayload, Selection } from "@/types";
import { landedPeople } from "@/utils";
import type { ReactNode } from "react";
import { useState } from "react";
import { RevealNotice } from "./RevealNotice";
import { WhoLandedWhere } from "./WhoLandedWhere";

interface RevealWindowProps {
  axisValues: number[];
  reveal?: RevealPayload;
  /** The Square the viewer holds, if this tab knows it. */
  selection: Selection | null;
  /** For a viewer who can still vote: a click on the grid votes (§6). */
  onSelect?: (selection: Selection) => void;
  /** The Squares people just moved to, and those people's chips (§7). */
  flashes?: ChangeFlashes;
  /** The ticket or task the Session estimated, when the admin gave one. */
  description?: string | null;
  /** The window's status chip: the viewer's role, when there is one. */
  chip?: string;
  /** A Square whose popover is open from the start. */
  initialPinned?: Selection | null;
  /** The dark notice's body, when not the live one. Welcome's demo can't vote, so it says so. */
  noticeBody?: string;
  /** Welcome's demo: the wave waits until the grid is wholly on screen. */
  holdsWaveUntilInView?: boolean;
  /** True on the Reveal screen, which has no h1, so its headings start at h2. */
  isScreenHeading?: boolean;
  /** Anything the page adds under the chips, like the mobile "Start a new session". */
  children?: ReactNode;
}

// The Reveal window (DESIGN.md §7): the dark notice, the revealed grid, and
// "who landed where" beneath it. The grid and the chips share one hover and one
// pinned popover, so a chip can preview or pin its Square.
//
// Its own component because two screens draw it: the Reveal itself, and the
// Welcome page's hero, which shows the real window on a sample Session. There
// the hero line is the h1, so every heading in here sits one level lower.
export function RevealWindow({
  axisValues,
  reveal,
  selection,
  onSelect,
  flashes,
  description = null,
  chip,
  initialPinned = null,
  noticeBody,
  holdsWaveUntilInView = false,
  isScreenHeading = false,
  children,
}: RevealWindowProps) {
  const [hovered, setHovered] = useState<HoveredSquare | null>(null);
  const [pinned, setPinned] = useState<Selection | null>(initialPinned);
  const content = useContent();
  const subheading = isScreenHeading ? "h2" : "h3";

  return (
    <Window title={content.reveal.windowTitle} variant={WindowVariant.SESSION} chip={chip}>
      <RevealNotice body={noticeBody ?? content.reveal.noticeLive} />

      <SessionDescription description={description} />

      <EstimationGrid
        axisValues={axisValues}
        mode={onSelect ? GridMode.REVEAL_VOTING : GridMode.READONLY}
        selection={selection}
        reveal={reveal}
        onSelect={onSelect}
        flashes={flashes?.squares}
        hovered={hovered}
        onHoveredChange={setHovered}
        pinned={pinned}
        onPinnedChange={setPinned}
        holdsWaveUntilInView={holdsWaveUntilInView}
      />

      <WhoLandedWhere
        heading={subheading}
        people={landedPeople(reveal)}
        abstained={reveal?.abstained ?? []}
        hovered={hovered}
        onHoveredChange={setHovered}
        pinned={pinned}
        onPinnedChange={setPinned}
        flashes={flashes?.names}
      />

      {children}
    </Window>
  );
}
