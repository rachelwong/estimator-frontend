import { AdminControls } from '@/components/AdminControls'
import { ErrorBanner } from '@/components/ErrorBanner'
import { EstimationGrid } from '@/components/EstimationGrid'
import { SessionStatusHeader } from '@/components/SessionStatusHeader'
import { ShareLink } from '@/components/ShareLink'
import { GridMode } from '@/constants'
import type { ActiveConnectionState, Selection } from '@/types'

interface ActiveSessionViewProps {
  sessionId: string
  state: ActiveConnectionState
  onSelect: (selection: Selection) => void
  onDismissError: () => void
  // Present for the Admin only.
  onEndSession?: () => void
}

// One view for Participant and Admin alike — the Admin is a Participant with
// one extra capability.
export function ActiveSessionView({
  sessionId,
  state,
  onSelect,
  onDismissError,
  onEndSession,
}: ActiveSessionViewProps) {
  return (
    <main className="mx-auto grid max-w-3xl gap-6 px-6 py-10">
      <SessionStatusHeader label="In Progress" />

      {onEndSession && (
        <div className="flex gap-4">
          <ShareLink sessionId={sessionId} />
          <AdminControls onEndSession={onEndSession} />
        </div>
      )}

      {state.error && <ErrorBanner error={state.error} onDismiss={onDismissError} />}

      <EstimationGrid
        axisValues={state.pointSystem.axisValues}
        mode={GridMode.INTERACTIVE}
        selection={state.selection}
        onSelect={onSelect}
      />
    </main>
  )
}
