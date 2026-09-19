import { ErrorBanner } from '@/components/ErrorBanner'
import { EstimationGrid } from '@/components/EstimationGrid'
import { Badge } from '@/components/ui/badge'
import { GridMode } from '@/constants'
import type { ActiveConnectionState, Selection } from '@/types'

interface ActiveSessionViewProps {
  state: ActiveConnectionState
  onSelect: (selection: Selection) => void
  onDismissError: () => void
}

// One view for Participant and Admin alike — the Admin is a Participant with
// one extra capability.
export function ActiveSessionView({ state, onSelect, onDismissError }: ActiveSessionViewProps) {
  return (
    <main className="mx-auto grid max-w-3xl gap-6 px-6 py-10">
      <div className="flex justify-center">
        <Badge variant="secondary">In Progress</Badge>
      </div>

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
