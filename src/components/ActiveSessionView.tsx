import { useState } from 'react'
import { AdminControls } from '@/components/AdminControls'
import { ErrorBanner } from '@/components/ErrorBanner'
import { EstimationGrid } from '@/components/EstimationGrid'
import { PageLayout } from '@/components/PageLayout'
import { ShareLink } from '@/components/ShareLink'
import { SpriteScatter } from '@/components/SpriteScatter'
import { Window } from '@/components/Window'
import { GridMode, SESSION_WINDOW_CLASS } from '@/constants'
import type { ActiveConnectionState, HoveredSquare, Selection } from '@/types'

interface ActiveSessionViewProps {
  sessionId: string
  state: ActiveConnectionState
  onSelect: (selection: Selection) => void
  onDismissError: () => void
  // Present for the Admin only.
  onEndSession?: () => void
}

// The Active screen (DESIGN.md §7). One view for Participant and Admin alike —
// the Admin is a Participant with one extra capability, so the difference is
// the share bar, the End button and the chip.
//
// End sits in the header from tablet up and moves to full width under the grid
// on mobile. Both are rendered and CSS shows one, so the confirm dialog belongs
// to whichever the viewport draws.
export function ActiveSessionView({
  sessionId,
  state,
  onSelect,
  onDismissError,
  onEndSession,
}: ActiveSessionViewProps) {
  const [hovered, setHovered] = useState<HoveredSquare | null>(null)
  const hasSelection = state.selection !== null

  return (
    <PageLayout
      actions={
        onEndSession && (
          <AdminControls
            onEndSession={onEndSession}
            className="hidden text-[12px] tablet:inline-flex"
          />
        )
      }
    >
      {onEndSession && <ShareLink sessionId={sessionId} />}

      <div className="relative isolate flex justify-center px-3 pt-8 pb-16 tablet:px-10 tablet:pt-10">
        <SpriteScatter />

        <Window
          title="live"
          chip={state.isAdmin ? 'Admin' : 'Participant'}
          className={SESSION_WINDOW_CLASS.window}
          bodyClassName={SESSION_WINDOW_CLASS.body}
        >
          <div className="flex flex-col gap-1.5">
            <h2 className="font-display text-[20px] leading-[1.05] text-ink tablet:text-[27px]">
              {hasSelection ? 'Hand’s down.' : 'Pick your Square'}
            </h2>
            <p className="font-body text-[15px] leading-[1.45] text-text-muted tablet:text-[16px]">
              {hasSelection
                ? 'Your Selection and its Area are only visible to you. Pick another Square to move it, or the same one to clear it.'
                : 'Time runs across, Resources go up. Your Selection stays private until the Reveal.'}
            </p>
          </div>

          {state.error && <ErrorBanner error={state.error} onDismiss={onDismissError} />}

          <EstimationGrid
            axisValues={state.pointSystem.axisValues}
            mode={GridMode.INTERACTIVE}
            selection={state.selection}
            onSelect={onSelect}
            hovered={hovered}
            onHoveredChange={setHovered}
          />

          {onEndSession && (
            <AdminControls
              onEndSession={onEndSession}
              className="h-[52px] w-full text-[14px] tablet:hidden"
            />
          )}
        </Window>
      </div>
    </PageLayout>
  )
}
