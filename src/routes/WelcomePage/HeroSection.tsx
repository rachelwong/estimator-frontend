import { RevealWindow } from "@/components/RevealWindow";
import { Button } from "@/components/ui/button";
import { WELCOME_DEMO_AXIS_VALUES, WELCOME_DEMO_PINNED, WelcomeSection } from "@/constants";
import { useContent } from "@/hooks";
import parse from "html-react-parser";
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
  const content = useContent();
  const hero = content.welcome.hero;

  return (
    // Work (NL-Welcome-*): the headline and the sample Reveal stack, set left,
    // over a rule; on a desktop they sit side by side in a 1200px row.
    <div className="bg-page-top pb-16 tablet:pb-24 work:border-b work:border-border-subtle work:px-3 work:pt-10 work:tablet:px-10 work:tablet:pt-16 work:tablet:pb-20 work:desktop:mx-auto work:desktop:flex work:desktop:max-w-[1440px] work:desktop:items-center work:desktop:gap-[72px] work:desktop:px-[120px] work:desktop:pt-20">
      <section className="relative isolate flex flex-col items-center gap-[18px] px-5 pt-12 text-center tablet:gap-6 tablet:px-10 tablet:pt-[84px] desktop:px-20 work:items-start work:gap-6 work:px-2 work:pt-0 work:text-left work:tablet:px-0 work:tablet:pt-0 work:desktop:w-[500px] work:desktop:shrink-0 work:desktop:px-0">
        <HeroSprites />

        <span className="rounded-control border-2 border-border bg-card px-3 py-1.5 font-label text-[12px] tablet:text-[14px] work:hidden">
          {hero.badge}
        </span>

        <h1 className="max-w-[1000px] font-display text-[36px] leading-none text-foreground tablet:text-[58px] desktop:text-[78px] work:text-[38px] work:leading-[1.04] work:font-medium work:tracking-[-0.025em] work:tablet:text-[52px] work:desktop:text-[60px]">
          {parse(hero.headlineLead)}
          <br className="work:hidden" />{" "}
          <span className="text-primary work:text-link">{hero.headlineAccent}</span>
        </h1>

        <p className="max-w-[600px] leading-[1.5] text-muted-foreground text-[18px] leading-[1.5] tablet:text-[21px] work:max-w-none work:text-[17px] work:leading-7 work:tablet:text-[19px] work:tablet:leading-[30px]">
          {parse(hero.body)}
        </p>

        <div className="flex w-full flex-col gap-4 pt-1.5 tablet:w-auto tablet:flex-row work:gap-3 work:pt-2">
          <StartSessionButton className="h-[52px] text-[14px] work:h-12 work:text-[16px] work:font-semibold" />

          <Button
            asChild
            variant="ghost"
            className="h-[52px] font-display text-[14px] font-normal work:h-12 work:text-[16px] work:font-medium"
          >
            <a href={`#${WelcomeSection.HOW_TO_USE}`}>{content.welcome.navigation.howToUse}</a>
          </Button>
        </div>
      </section>

      <div className="relative isolate flex justify-center px-3 pt-14 text-left tablet:px-10 tablet:pt-[72px] work:px-0 work:pt-10 work:tablet:px-0 work:tablet:pt-14 work:desktop:min-w-0 work:desktop:flex-1 work:desktop:pt-0">
        <DemoSprites />

        <RevealWindow
          axisValues={WELCOME_DEMO_AXIS_VALUES}
          reveal={content.welcome.demo.reveal}
          selection={null}
          description={content.welcome.demo.description}
          initialPinned={WELCOME_DEMO_PINNED}
          noticeBody={content.reveal.noticeDemo}
          holdsWaveUntilInView
        />
      </div>
    </div>
  );
}
