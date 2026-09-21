import { PageLayout } from '@/components/PageLayout'
import { RevealWindow } from '@/components/RevealWindow'
import { ShareLink } from '@/components/ShareLink'
import { SpriteScatter } from '@/components/SpriteScatter'
import type { GetSessionResponse, RevealViewer } from '@/types'
import { revealChip } from '@/utils'
import { StartSessionLink } from './StartSessionLink'

interface RevealViewProps {
  session: GetSessionResponse
  viewer: RevealViewer
}

// The Reveal screen (DESIGN.md §7): the Reveal window, with the share bar above
// it for the Admin.
//
// "Start a new session" sits in the header from tablet up and full width at
// the bottom on mobile, as End does on Active. Everyone gets it — the artboard
// draws it for either role, and the Session it would start is a fresh one.
export function RevealView({ session, viewer }: RevealViewProps) {
  return (
    <PageLayout actions={<StartSessionLink className="hidden text-[12px] tablet:inline-flex" />}>
      {viewer.isAdmin && <ShareLink sessionId={session.sessionId} />}

      <div className="relative isolate flex justify-center px-3 pt-8 pb-16 tablet:px-10 tablet:pt-10">
        <SpriteScatter />

        <RevealWindow
          axisValues={session.pointSystem.axisValues}
          reveal={session.reveal}
          selection={viewer.selection}
          chip={revealChip(viewer)}
          isScreenHeading
        >
          <StartSessionLink className="h-[52px] w-full text-[14px] tablet:hidden" />
        </RevealWindow>
      </div>
    </PageLayout>
  )
}
