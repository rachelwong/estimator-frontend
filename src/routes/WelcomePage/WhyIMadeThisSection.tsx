import code from "@/assets/sprites/code.svg";
import { Sprite } from "@/components/Sprite";
import { Button } from "@/components/ui/button";
import { REPOSITORY_URL, WelcomeSection } from "@/constants";
import { useContent } from "@/hooks";
import { MakerNote } from "./MakerNote";
import { WelcomeSectionHeading } from "./WelcomeSectionHeading";

// Why I made this (§7 item 6), a zine spread: the heading on an ink rule, three
// notes split by ink rules, then a "read the source" bar with the sign-off and
// both repos. Desktop runs the notes in three columns; tablet puts the problem
// and the idea side by side with the build across the bottom; a phone stacks
// everything.
export function WhyIMadeThisSection() {
  const why = useContent().welcome.whyIMadeThis;

  return (
    <section
      id={WelcomeSection.WHY_I_MADE_THIS}
      className="flex flex-col gap-7 px-5 pt-20 scroll-mt-16 tablet:gap-8 tablet:px-10 tablet:pt-[110px] tablet:scroll-mt-[72px] desktop:gap-9 desktop:px-20 desktop:scroll-mt-[84px]"
    >
      <div className="pb-3.5 tablet:pb-4 desktop:pb-[18px]">
        <WelcomeSectionHeading text={why.heading} />
      </div>
      <div className="grid gap-3.5 tablet:grid-cols-2 tablet:gap-4 desktop:flex mx-auto">
        <Button
          asChild
          className="h-[52px] w-full text-[16px] desktop:w-auto desktop:px-[22px]"
        >
          <a href={REPOSITORY_URL.FRONTEND} target="_blank">
            <Sprite source={code} className="w-[18px]" />
            {why.frontendLink}
          </a>
        </Button>
        <Button
          asChild
          variant="secondary"
          className="h-[52px] w-full text-[16px] desktop:w-auto desktop:px-[22px]"
        >
          <a href={REPOSITORY_URL.BACKEND} target="_blank">
            <Sprite source={code} className="w-[18px]" />
            {why.backendLink}
          </a>
        </Button>
      </div>

      <div className="grid gap-7 tablet:grid-cols-2 tablet:gap-0 desktop:grid-cols-3">
        <MakerNote
          label={why.experience.label}
          text={why.experience.text}
          className="tablet:border-r-2 tablet:border-border-subtle tablet:pr-7 tablet:pb-7 desktop:pr-9 desktop:pb-0"
        />
        <MakerNote
          label={why.idea.label}
          text={why.idea.text}
          className="tablet:pb-7 tablet:pl-7 desktop:border-r-2 desktop:border-border-subtle desktop:px-9 desktop:pb-0"
        />
        <MakerNote
          label={why.build.label}
          text={why.build.text}
          className="tablet:col-span-2 tablet:border-t-2 tablet:border-border-subtle tablet:pt-7 desktop:col-span-1 desktop:border-t-0 desktop:pt-0 desktop:pl-9"
        />
      </div>
    </section>
  );
}
