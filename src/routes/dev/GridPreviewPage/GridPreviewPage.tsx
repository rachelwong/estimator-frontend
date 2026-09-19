import { useState } from 'react'
import { AppHeader } from '@/components/AppHeader'
import { EstimationGrid } from '@/components/EstimationGrid'
import { GridMode } from '@/constants'
import type { Selection } from '@/types'
import { DEV_AXIS_VALUES, DEV_REVEAL } from './fixtures.dev'

// DEV ONLY — TEMPORARY. Served at /dev/grid in dev builds only. Checks
// EstimationGrid against the Miro screens before live data exists. Delete this
// whole folder, and its route in router.tsx, once Phase 12 renders the Reveal.
export function GridPreviewPage() {
  const [selection, setSelection] = useState<Selection | null>(null)

  // Same toggle the server applies: same Square clears, another one moves.
  function handleSelect(next: Selection) {
    const isSame = selection?.time === next.time && selection?.resource === next.resource

    setSelection(isSame ? null : next)
  }

  return (
    <>
      <AppHeader />

      <main className="mx-auto grid max-w-5xl grid-cols-2 gap-10 px-6 py-10">
        <section className="grid content-start gap-4">
          <h2 className="text-xl font-semibold">Interactive</h2>
          <EstimationGrid
            axisValues={DEV_AXIS_VALUES}
            mode={GridMode.INTERACTIVE}
            selection={selection}
            onSelect={handleSelect}
          />
        </section>

        <section className="grid content-start gap-4">
          <h2 className="text-xl font-semibold">Readonly</h2>
          <EstimationGrid
            axisValues={DEV_AXIS_VALUES}
            mode={GridMode.READONLY}
            reveal={DEV_REVEAL}
          />
        </section>
      </main>
    </>
  )
}
