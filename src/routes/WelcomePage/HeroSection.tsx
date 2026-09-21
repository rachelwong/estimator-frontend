import { RevealWindow } from "@/components/RevealWindow";
import { Button } from "@/components/ui/button";
import {
  WELCOME_DEMO_AXIS_VALUES,
  WELCOME_DEMO_PINNED,
  WELCOME_DEMO_REVEAL,
  WELCOME_GUTTER_CLASS,
  WelcomeSection,
} from "@/constants";
import { cn } from "@/lib/utils";
import { DemoSprites } from "./DemoSprites";
import { HeroSprites } from "./HeroSprites";
import { StartSessionButton } from "./StartSessionButton";

// The top of Welcome on `page-top` lavender (§7 items 2 and 3): the badge, the
// hero line, what the app is, the two ways in — and under them the real Reveal
// window on a sample Session. Its wave rolls the first time the whole grid is
// on screen, and then it opens on its crowded Square's popover.
//
// The demo sits in the Reveal screen's own frame: 12px from a phone's edges
// rather than the page's 20, so the window is the 366 the grid is sized for.
// The hero line is the page's h1, so the sample Reveal's own heading drops to h2.
export function HeroSection() {
  return (
    <div className="bg-page-top pb-16 tablet:pb-24">
      <section
        className={cn(
          "relative isolate flex flex-col items-center gap-[18px] pt-12 text-center tablet:gap-6 tablet:pt-[84px]",
          WELCOME_GUTTER_CLASS,
        )}
      >
        <HeroSprites />

        <span className="border-2 border-ink bg-white px-3 py-1.5 font-label text-[12px] tablet:text-[14px]">
          Planning poker, minus the poker face
        </span>

        <h1 className="max-w-[1000px] font-display text-[36px] leading-none text-ink tablet:text-[58px] desktop:text-[78px]">
          Teams who
          <br />
          estimate together
          <br />
          <span className="text-accent">ship together</span>
        </h1>

        <p className="max-w-[600px] text-[18px] leading-[1.5] text-text-muted tablet:text-[21px]">
          A live estimation board for dev teams. Share a link, everyone picks a
          Square on a Time × Resources grid in private, then the Reveal shows
          where you all landed.
        </p>

        <div className="flex w-full flex-col gap-4 pt-1.5 tablet:w-auto tablet:flex-row">
          <StartSessionButton className="h-[52px] text-[14px]" />

          <Button
            asChild
            variant="secondary"
            className="h-[52px] font-display text-[14px] font-normal"
          >
            <a href={`#${WelcomeSection.HOW_TO_PLAY}`}>How to play</a>
          </Button>
        </div>
      </section>

      <div className="relative isolate flex justify-center px-3 pt-14 text-left tablet:px-10 tablet:pt-[72px]">
        <DemoSprites />

        <RevealWindow
          axisValues={WELCOME_DEMO_AXIS_VALUES}
          reveal={WELCOME_DEMO_REVEAL}
          selection={null}
          initialPinned={WELCOME_DEMO_PINNED}
          holdsWaveUntilInView
        />
      </div>
    </div>
  );
}
