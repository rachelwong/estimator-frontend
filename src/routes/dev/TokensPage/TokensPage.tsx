import { BREAKPOINT_PX, CROWD_CLASS } from '@/constants'
import { cn } from '@/lib/utils'
import { SwatchRow } from './SwatchRow'
import { TypeRow } from './TypeRow'
import {
  DEV_BODY_WEIGHTS,
  DEV_CROWD_MEANING,
  DEV_SHADOWS,
  DEV_SURFACES,
  DEV_TEXT_COLOURS,
  DEV_TYPE_SCALE,
} from './fixtures.dev'

// DEV ONLY — TEMPORARY. Served at /dev/tokens in dev builds only.
//
// Stage 1's proof: the palette, the crowd ramp and the type scale, rendered
// from the same tokens and constants every later stage composes against.
// Contrast and font size are read back off the painted nodes, so the sheet
// reports what the browser did rather than what DESIGN.md hoped for. Resize
// past 768 and 1200 to walk the three artboards.
//
// Delete this folder, and its route in router.tsx, once the screens it stands
// in for exist.
export function TokensPage() {
  return (
    <main className="mx-auto grid max-w-5xl gap-10 bg-cream px-5 py-10 tablet:px-10">
      <header className="grid gap-2">
        <h1 className="font-display text-[27px] text-ink tablet:text-[36px] desktop:text-[44px]">
          Tokens
        </h1>
        <p className="font-body text-[16px] text-text-muted">
          Viewport is{' '}
          <span className="font-bold text-ink">
            <span className="tablet:hidden">mobile</span>
            <span className="hidden tablet:inline desktop:hidden">tablet</span>
            <span className="hidden desktop:inline">desktop</span>
          </span>{' '}
          — mobile below {BREAKPOINT_PX.TABLET}px, desktop from {BREAKPOINT_PX.DESKTOP}px.
        </p>
      </header>

      <section className="grid gap-4">
        <h2 className="font-label text-[12px] text-ink">surfaces</h2>
        <div className="grid gap-3 tablet:grid-cols-2">
          {DEV_SURFACES.map((surface) => (
            <SwatchRow key={surface.token} {...surface} />
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="font-label text-[12px] text-ink">text colours</h2>
        <div className="grid gap-3 tablet:grid-cols-2">
          {DEV_TEXT_COLOURS.map((colour) => (
            <SwatchRow key={colour.token} {...colour} />
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="font-label text-[12px] text-ink">crowd ramp</h2>
        <p className="font-body text-[16px] text-text-muted">
          Rendered from CROWD_CLASS, the lookup the grid will index by headcount. The ramp
          reflects how many people landed on a Square, never Time or Resources.
        </p>
        <div className="grid gap-3 tablet:grid-cols-2">
          {CROWD_CLASS.map((crowdClass, step) => (
            <SwatchRow
              key={crowdClass}
              token={`crowd-${step}`}
              bgClass={crowdClass}
              fgClass=""
              use={DEV_CROWD_MEANING[step]}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="font-label text-[12px] text-ink">type scale</h2>
        <div className="grid gap-3">
          {DEV_TYPE_SCALE.map((row) => (
            <TypeRow key={row.role} {...row} />
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="font-label text-[12px] text-ink">figtree weights</h2>
        <div className="grid gap-2 border-2 border-ink bg-white p-4">
          {DEV_BODY_WEIGHTS.map((weight) => (
            <p key={weight.label} className={cn('text-[18px] text-ink', weight.class)}>
              {weight.label} — Everyone plays a hand. Nobody peeks.
            </p>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="font-label text-[12px] text-ink">offset shadows</h2>
        <div className="grid gap-6 tablet:grid-cols-2">
          {DEV_SHADOWS.map((shadow) => (
            <div key={shadow.token} className={cn('border-[3px] border-ink bg-white p-4', shadow.class)}>
              <p className="font-label text-[12px] text-ink">{shadow.token}</p>
              <p className="font-body text-[14px] text-text-muted">{shadow.use}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
