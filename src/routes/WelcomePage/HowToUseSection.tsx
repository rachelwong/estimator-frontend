import avatar from "@/assets/sprites/avatar2.svg";
import gridPick from "@/assets/sprites/grid-pick.svg";
import gridReveal from "@/assets/sprites/grid-reveal.svg";
import sessionStart from "@/assets/sprites/session-start.svg";
import { WelcomeSection } from "@/constants";
import { useContent } from "@/hooks";
import parse from "html-react-parser";
import { HowToUseCard } from "./HowToUseCard";
import { WelcomeSectionHeading } from "./WelcomeSectionHeading";

// Four cards, LV.1 to LV.4, one per step of a Session (§7 item 5): four across
// on desktop, two on tablet, one on a phone. Written out rather than mapped
// from a table — each card's sprite and tint are its own.
export function HowToUseSection() {
  const howToUse = useContent().welcome.howToUse;

  return (
    <section
      id={WelcomeSection.HOW_TO_USE}
      className="flex flex-col gap-7 px-5 pt-8 scroll-mt-16 tablet:gap-10 tablet:px-10 tablet:pt-12 tablet:scroll-mt-[72px] desktop:px-20 desktop:scroll-mt-[84px] work:mx-auto work:w-full work:max-w-[1440px] work:px-5 work:tablet:px-10 work:desktop:px-[120px] work:scroll-mt-14 work:gap-8 work:pt-14 work:tablet:gap-12 work:tablet:pt-[72px] work:tablet:scroll-mt-14 work:desktop:grid work:desktop:grid-cols-[5fr_7fr] work:desktop:gap-x-16 work:desktop:gap-y-12 work:desktop:pt-24 work:desktop:scroll-mt-14"
    >
      <WelcomeSectionHeading text={howToUse.heading} />
      <div className="max-w-3xl mx-auto text-center flex flex-col gap-y-6 text-[18px] leading-[1.5] text-muted-foreground tablet:text-[18px] work:mx-0 work:max-w-none work:gap-y-5 work:text-left work:text-[17px] work:leading-7 work:tablet:text-[17px]">
        <p>{parse(howToUse.intro)}</p>
      </div>
      <ol className="grid gap-5 tablet:grid-cols-2 tablet:gap-7 desktop:grid-cols-4 work:gap-4 work:tablet:gap-4 work:desktop:col-span-2">
        <HowToUseCard
          level={1}
          title={howToUse.startSession.title}
          description={howToUse.startSession.description}
          sprite={sessionStart}
          tintClass="bg-tint-plain"
        />
        <HowToUseCard
          level={2}
          title={howToUse.cardsDown.title}
          description={howToUse.cardsDown.description}
          sprite={gridPick}
          tintClass="bg-tint-butter"
        />
        <HowToUseCard
          level={3}
          title={howToUse.theFlip.title}
          description={howToUse.theFlip.description}
          sprite={gridReveal}
          tintClass="bg-tint-mint"
        />
        <HowToUseCard
          level={4}
          title={howToUse.talkItThrough.title}
          description={howToUse.talkItThrough.description}
          sprite={avatar}
          tintClass="bg-tint-lavender"
        />
      </ol>
    </section>
  );
}
