import { createPortal } from 'react-dom'
import { AdminControls } from '@/components/AdminControls'
import { ErrorBanner } from '@/components/ErrorBanner'
import { EstimationGrid } from '@/components/EstimationGrid'
import { ShareLink } from '@/components/ShareLink'
import { SpriteScatter } from '@/components/SpriteScatter'
import { Window } from '@/components/Window'
import { GridMode } from '@/constants'
import type { ActiveConnectionState, Selection } from '@/types'

interface ActiveSessionViewProps {
  sessionId: string
  state: ActiveConnectionState
  /** RootLayout's header slot — null until it mounts. */
  headerSlot: HTMLElement | null
  onSelect: (selection: Selection) => void
  onDismissError: () => void
  // Present for the Admin only.
  onEndSession?: () => void
}

// The Active screen (DESIGN.md §7). One view for Participant and Admin alike —
// the Admin is a Participant with one extra capability, so the difference is
// the share bar, the End button and the chip.
//
// End sits in the header from tablet up — portalled into RootLayout's header
// slot, so it stays this view's own element with this view's callback — and
// moves to full width under the grid on mobile. Both are rendered and CSS shows
// one, so the confirm dialog belongs to whichever the viewport draws.
export function ActiveSessionView({
  sessionId,
  state,
  headerSlot,
  onSelect,
  onDismissError,
  onEndSession,
}: ActiveSessionViewProps) {
  const hasSelection = state.selection !== null

  return (
    <>
      {onEndSession &&
        headerSlot &&
        createPortal(
          <AdminControls
            onEndSession={onEndSession}
            className="hidden text-[12px] tablet:inline-flex"
          />,
          headerSlot,
        )}

      {onEndSession && <ShareLink sessionId={sessionId} />}

      <main className="relative isolate flex justify-center px-3 pt-8 pb-16 tablet:px-10 tablet:pt-10">
        <SpriteScatter />

        {/* Tighter than the Window default on mobile: a Fibonacci 7×7 at 39px
            needs 335px, and the default padding leaves 328. */}
        <Window
          title="live"
          chip={state.isAdmin ? 'Admin' : 'Participant'}
          className="w-full max-w-[366px] tablet:max-w-[740px] desktop:max-w-[780px]"
          bodyClassName="gap-3.5 px-3 pt-2.5 pb-3.5 desktop:px-9 desktop:pt-7"
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
          />

          {onEndSession && (
            <AdminControls
              onEndSession={onEndSession}
              className="h-[52px] w-full text-[14px] tablet:hidden"
            />
          )}
        </Window>
      </main>
    </>
  )
}
