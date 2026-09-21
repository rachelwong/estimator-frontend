import { useState } from 'react'
import { EstimationGrid } from '@/components/EstimationGrid'
import { PageLayout } from '@/components/PageLayout'
import { ShareLink } from '@/components/ShareLink'
import { SpriteScatter } from '@/components/SpriteScatter'
import { Window } from '@/components/Window'
import { GridMode, SESSION_WINDOW_CLASS } from '@/constants'
import type { GetSessionResponse, HoveredSquare, RevealViewer, Selection } from '@/types'
import { landedPeople } from '@/utils'
import { RevealNotice } from './RevealNotice'
import { StartSessionLink } from './StartSessionLink'
import { WhoLandedWhere } from './WhoLandedWhere'

interface RevealViewProps {
  session: GetSessionResponse
  viewer: RevealViewer
}

// The Reveal screen (DESIGN.md §7): the dark notice, the revealed grid, and
// "who landed where" beneath it. The grid and the chips share one hover and one
// pinned popover, so a chip can preview or pin its Square.
//
// "Start a new session" sits in the header from tablet up and full width at
// the bottom on mobile, as End does on Active. Everyone gets it — the artboard
// draws it for either role, and the Session it would start is a fresh one.
export function RevealView({ session, viewer }: RevealViewProps) {
  const [hovered, setHovered] = useState<HoveredSquare | null>(null)
  const [pinned, setPinned] = useState<Selection | null>(null)
  const chip = viewer.isAdmin ? 'Admin' : viewer.hasJoined ? 'Participant' : undefined

  return (
    <PageLayout actions={<StartSessionLink className="hidden text-[12px] tablet:inline-flex" />}>
      {viewer.isAdmin && <ShareLink sessionId={session.sessionId} />}

      <div className="relative isolate flex justify-center px-3 pt-8 pb-16 tablet:px-10 tablet:pt-10">
        <SpriteScatter />

        <Window
          title="revealed"
          chip={chip}
          className={SESSION_WINDOW_CLASS.window}
          bodyClassName={SESSION_WINDOW_CLASS.body}
        >
          <RevealNotice />

          <div className="flex flex-col gap-1.5">
            <h2 className="font-display text-[20px] leading-[1.05] text-ink tablet:text-[27px]">
              The Reveal
            </h2>
            <p className="font-body text-[15px] leading-[1.45] text-text-muted tablet:text-[16px]">
              Darker Squares are where more people landed.
            </p>
          </div>

          <EstimationGrid
            axisValues={session.pointSystem.axisValues}
            mode={GridMode.READONLY}
            selection={viewer.selection}
            reveal={session.reveal}
            hovered={hovered}
            onHoveredChange={setHovered}
            pinned={pinned}
            onPinnedChange={setPinned}
          />

          <WhoLandedWhere
            people={landedPeople(session.reveal)}
            abstained={session.reveal?.abstained ?? []}
            hovered={hovered}
            onHoveredChange={setHovered}
            pinned={pinned}
            onPinnedChange={setPinned}
          />

          <StartSessionLink className="h-[52px] w-full text-[14px] tablet:hidden" />
        </Window>
      </div>
    </PageLayout>
  )
}
