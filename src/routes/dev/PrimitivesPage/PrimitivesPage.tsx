import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { PageLayout } from "@/components/PageLayout";
import { PixelProgressBar } from "@/components/PixelProgressBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Window } from "@/components/Window";
import { BREAKPOINT_PX, PixelBarSize } from "@/constants";
import { cn } from "@/lib/utils";
import { DEV_CARDS, DEV_CHIPS, DEV_WINDOWS } from "./fixtures.dev";

// DEV ONLY — TEMPORARY. Served at /dev/primitives in dev builds only.
//
// Stage 3's proof: the Window, Card and Chip, the restyled button and input,
// and the loader at both sizes. Resize past 768 and 1200 to walk the three
// artboards — the windows carry the widths §5 gives each screen.
//
// Turn on reduced motion at the OS level to check the loader holds still: the
// fill stops full rather than part-way, because the global rule collapses the
// animation's duration instead of pausing it mid-step.
//
// Delete this folder, and its route in router.tsx, once the screens it stands
// in for exist.
export function PrimitivesPage() {
  return (
    <PageLayout>
      <div className="mx-auto grid max-w-5xl gap-10 bg-cream px-5 py-10 tablet:px-10">
        <header className="grid gap-2">
          <h1 className="font-display text-[27px] text-ink tablet:text-[36px] desktop:text-[44px]">
            Primitives
          </h1>
          <p className="font-body text-[16px] text-text-muted">
            Viewport is{" "}
            <span className="font-bold text-ink">
              <span className="tablet:hidden">mobile</span>
              <span className="hidden tablet:inline desktop:hidden">
                tablet
              </span>
              <span className="hidden desktop:inline">desktop</span>
            </span>{" "}
            — mobile below {BREAKPOINT_PX.TABLET}px, desktop from{" "}
            {BREAKPOINT_PX.DESKTOP}px.
          </p>
        </header>

        <section className="grid gap-4">
          <h2 className="font-label text-[12px] text-ink">windows</h2>
          <p className="font-body text-[16px] text-text-muted">
            44px accent title bar, white Silkscreen title, status chip and three
            chrome dots, a 3px ink rule beneath, and an 8px offset shadow. The
            title truncates rather than wrapping the bar to two rows.
          </p>
          <div className="grid justify-items-start gap-8">
            {DEV_WINDOWS.map((frame) => (
              <Window
                key={frame.title}
                title={frame.title}
                chip={frame.chip}
                className={frame.widthClass}
              >
                <p className="font-body text-[16px] text-text-muted">
                  {frame.body}
                </p>
              </Window>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="font-label text-[12px] text-ink">chips</h2>
          <div className="flex flex-wrap items-center gap-3 border-2 border-ink bg-white p-5">
            {DEV_CHIPS.map((chip) => (
              <Chip
                key={chip.label}
                variant={chip.variant}
                size={chip.size}
                className={chip.className}
              >
                {chip.label}
              </Chip>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="font-label text-[12px] text-ink">cards</h2>
          <div className="grid gap-6 tablet:grid-cols-2 desktop:grid-cols-4">
            {DEV_CARDS.map((card) => (
              <Card
                key={card.title}
                className={cn("grid gap-3", card.tintClass)}
              >
                <span className="w-fit bg-ink px-2 py-1 font-label text-[13px] text-cream">
                  {card.title}
                </span>
                <p className="font-body text-[16px] text-text-muted">
                  {card.body}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="font-label text-[12px] text-ink">buttons</h2>
          <p className="font-body text-[16px] text-text-muted">
            Press one: it moves 4px onto its own shadow, which is the whole
            depth model. Tab to one to see the offset ink outline.
          </p>
          <div className="flex flex-wrap items-center gap-6 border-2 border-ink bg-white p-5">
            <Button>Copy link</Button>
            <Button variant="secondary">Back to Home</Button>
            <Button variant="destructive">End session &amp; reveal</Button>
            <Button size="lg">Create session</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="font-label text-[12px] text-ink">inputs</h2>
          <div className="grid max-w-md gap-4 border-2 border-ink bg-white p-5">
            <Input aria-label="Your name" placeholder="Your name" />
            <Input
              aria-label="Invalid name"
              defaultValue="Jim@Bob"
              aria-invalid
            />
            <Input aria-label="Disabled" defaultValue="Disabled" disabled />
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="font-label text-[12px] text-ink">loader</h2>
          <p className="font-body text-[16px] text-text-muted">
            Large is 220×18 in eight blocks; inline is 40×6 in five. The fill
            steps in whole blocks and starts again — it never reports a fraction
            of a wait nobody can measure.
          </p>
          <div className="flex flex-wrap items-center gap-10 border-2 border-ink bg-white p-8">
            <PixelProgressBar />

            <span className="inline-flex items-center gap-2.5 font-body text-[15px] text-text-muted">
              <PixelProgressBar size={PixelBarSize.INLINE} />
              Joining checkout-redesign…
            </span>

            <Button disabled>
              <PixelProgressBar size={PixelBarSize.INLINE} />
              Creating session…
            </Button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
