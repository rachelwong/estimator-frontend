import { useState } from 'react'
import type { ReactNode } from 'react'
import { EstimationGrid } from '@/components/EstimationGrid'
import { Window } from '@/components/Window'
import { GridMode, SESSION_WINDOW_CLASS } from '@/constants'
import type { HoveredSquare, RevealPayload, Selection } from '@/types'
import { landedPeople } from '@/utils'
import { RevealNotice } from './RevealNotice'
import { WhoLandedWhere } from './WhoLandedWhere'

interface RevealWindowProps {
  axisValues: number[]
  reveal?: RevealPayload
  /** The Square the viewer held when the Session ended, if this tab knows it. */
  selection: Selection | null
  /** The window's status chip: the viewer's role, when there is one. */
  chip?: string
  /** A Square whose popover is open from the start. */
  initialPinned?: Selection | null
  /** Welcome's demo: the wave waits until the grid is wholly on screen. */
  holdsWaveUntilInView?: boolean
  /** True on the Reveal screen, where "The Reveal" is the page's h1. */
  isScreenHeading?: boolean
  /** Anything the page adds under the chips, like the mobile "Start a new session". */
  children?: ReactNode
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
  chip,
  initialPinned = null,
  holdsWaveUntilInView = false,
  isScreenHeading = false,
  children,
}: RevealWindowProps) {
  const [hovered, setHovered] = useState<HoveredSquare | null>(null)
  const [pinned, setPinned] = useState<Selection | null>(initialPinned)
  const Heading = isScreenHeading ? 'h1' : 'h2'
  const subheading = isScreenHeading ? 'h2' : 'h3'

  return (
    <Window
      title="revealed"
      chip={chip}
      className={SESSION_WINDOW_CLASS.window}
      bodyClassName={SESSION_WINDOW_CLASS.body}
    >
      <RevealNotice />

      <div className="flex flex-col gap-1.5">
        <Heading className="font-display text-[20px] leading-[1.05] text-ink tablet:text-[27px]">
          The Reveal
        </Heading>
        <p className="font-body text-[15px] leading-[1.45] text-text-muted tablet:text-[16px]">
          Darker Squares are where more people landed.
        </p>
      </div>

      <EstimationGrid
        axisValues={axisValues}
        mode={GridMode.READONLY}
        selection={selection}
        reveal={reveal}
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
      />

      {children}
    </Window>
  )
}
