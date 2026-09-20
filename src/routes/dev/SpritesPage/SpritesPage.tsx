import { LogoLockup, LogoMark } from '@/components/LogoLockup'
import { Sprite, SpriteMask } from '@/components/Sprite'
import { SpriteScatter } from '@/components/SpriteScatter'
import { BREAKPOINT_PX } from '@/constants'
import { cn } from '@/lib/utils'
import { SpriteCell } from './SpriteCell'
import { DEV_RECOLOURS, DEV_SPADE_URL, DEV_SPRITE_GROUPS } from './fixtures.dev'

// DEV ONLY — TEMPORARY. Served at /dev/sprites in dev builds only.
//
// Stage 2's proof: all 30 sprites, the recolour surface, the logo cycle and the
// scatter placement. Resize past 768 and 1200 to walk the three artboards and
// watch the scatter drop from the full ring to sides to the top pair only.
//
// Turn on reduced motion at the OS level to check the logo holds still and
// stays tilted. Tab through the page to check no sprite takes focus.
//
// Delete this folder, and its route in router.tsx, once the screens it stands
// in for exist.
export function SpritesPage() {
  return (
    <main className="mx-auto grid max-w-5xl gap-10 bg-cream px-5 py-10 tablet:px-10">
      <header className="grid gap-2">
        <h1 className="font-display text-[27px] text-ink tablet:text-[36px] desktop:text-[44px]">
          Sprites
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
        <h2 className="font-label text-[12px] text-ink">logo</h2>
        <p className="font-body text-[16px] text-text-muted">
          Rests at −8°. Every 7s: a shake, a flip to a random value, a hold, a flip back. The
          value is picked on the inner element&apos;s animationiteration, so it never swaps
          mid-flip. Never the same value twice in a row.
        </p>
        <div className="flex flex-wrap items-center gap-10 border-2 border-ink bg-white p-8">
          <LogoMark className="h-24 w-[68px]" />
          <LogoLockup />
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="font-label text-[12px] text-ink">recolour</h2>
        <p className="font-body text-[16px] text-text-muted">
          Sprites are plain <code>&lt;img&gt;</code>, so CSS cannot reach a fill inside one. The
          design recolours exactly one sprite — the cream spade on the Reveal&apos;s dark notice
          (§7) — and that one renders as a mask, so its colour is a real palette token. Only
          single-colour marks qualify: masking a character would flatten it to a silhouette.
        </p>
        <div className="grid gap-3 tablet:grid-cols-2 desktop:grid-cols-4">
          {DEV_RECOLOURS.map((recolour) => (
            <div
              key={recolour.label}
              className={cn(
                'grid justify-items-center gap-3 border-2 border-ink p-4',
                recolour.surfaceClass,
              )}
            >
              {recolour.colourClass ? (
                <SpriteMask
                  source={DEV_SPADE_URL}
                  colourClass={recolour.colourClass}
                  className="h-16 w-16"
                />
              ) : (
                <Sprite source={DEV_SPADE_URL} className="h-16 w-16" />
              )}

              <p className={cn('text-center font-label text-[10px]', recolour.labelClass)}>
                {recolour.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="font-label text-[12px] text-ink">scatter placement</h2>
        <p className="font-body text-[16px] text-text-muted">
          The cast sits behind the window at a negative z-index and takes no pointer events.
        </p>
        <div className="relative isolate grid min-h-[420px] place-items-center py-10">
          <SpriteScatter />
          <div className="w-full max-w-md border-[3px] border-ink bg-white shadow-px-window">
            <div className="flex h-11 items-center px-4 font-label text-[12px] text-white bg-accent">
              window
            </div>
            <p className="p-6 font-body text-[16px] text-text-muted">
              Characters always sit behind this.
            </p>
          </div>
        </div>
      </section>

      {DEV_SPRITE_GROUPS.map((group) => (
        <section key={group.title} className="grid gap-4">
          <h2 className="font-label text-[12px] text-ink">{group.title}</h2>
          <div className="grid grid-cols-2 gap-3 tablet:grid-cols-4 desktop:grid-cols-5">
            {group.sprites.map((sprite) => (
              <SpriteCell key={sprite.source} {...sprite} />
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
