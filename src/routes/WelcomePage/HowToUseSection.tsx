import avatar from "@/assets/sprites/avatar2.svg";
import gridPick from "@/assets/sprites/grid-pick.svg";
import gridReveal from "@/assets/sprites/grid-reveal.svg";
import sessionStart from "@/assets/sprites/session-start.svg";
import { WelcomeSection } from "@/constants";
import { HowToUseCard } from "./HowToUseCard";
import { WelcomeSectionHeading } from "./WelcomeSectionHeading";

// Four cards, LV.1 to LV.4, one per step of a Session (§7 item 5): four across
// on desktop, two on tablet, one on a phone. Written out rather than mapped
// from a table — each card's sprite and tint are its own.
export function HowToUseSection() {
  return (
    <section
      id={WelcomeSection.HOW_TO_USE}
      className="flex flex-col gap-7 px-5 pt-8 scroll-mt-16 tablet:gap-10 tablet:px-10 tablet:pt-12 tablet:scroll-mt-[72px] desktop:px-20 desktop:scroll-mt-[84px]"
    >
      <WelcomeSectionHeading text="How to use" />
      <div className="max-w-4xl mx-auto text-center flex flex-col gap-y-6 text-[18px] leading-[1.5] text-text-muted tablet:text-[18px]">
        <p>
          {" "}
          Estimation is hard. Teams have to weigh up unknowns, dependencies and
          effort so that product owners, team leads and businesses can make
          calls that affect everyone. <br />
          All too often the first number callout or the loudest voices becomes
          the answer. <br />
          <strong>Fold & Flip</strong> is an ice-breaker/planning-poker tool
          that gives every team member a chance to estimate. It keeps every
          estimate hidden until the reveal, so you hear what the entire team
          actually thinks. Every story point estimate on the grid is a function
          of <strong>time</strong> and <strong>resources</strong> (or effort),
          relative to other tasks or tickets in queue.
          <br />
          Estimating story points is a conversation starter, not a line in the
          sand.
        </p>
      </div>
      <ol className="grid gap-5 tablet:grid-cols-2 tablet:gap-7 desktop:grid-cols-4">
        <HowToUseCard
          level={1}
          title="Start a session"
          sprite={sessionStart}
          tintClass="bg-white"
        >
          Choose a Point system (Numerical or{" "}
          <a
            href="https://www.atlassian.com/agile/project-management/fibonacci-story-points"
            target="_blank"
            className="link"
          >
            Fibonacci
          </a>
          ) to set the maximum number of story points you can allocate towards a
          feature or a ticket.
          <br />
          Share the link with the team.
        </HowToUseCard>
        <HowToUseCard
          level={2}
          title="Cards down"
          sprite={gridPick}
          tintClass="bg-butter"
        >
          Everyone selects a square on the points grid, with time on one axis
          and resources (or effort) on the other. Nobody sees anyone else's
          estimate.
        </HowToUseCard>
        <HowToUseCard
          level={3}
          title="The Flip"
          sprite={gridReveal}
          tintClass="bg-copied"
        >
          Once admin has confirmed everyone has voted, the session is ended. All
          the votes are revealed, including anyone who might have abstained.
        </HowToUseCard>
        <HowToUseCard
          level={4}
          title="Talk it through"
          sprite={avatar}
          tintClass="bg-crowd-0"
        >
          The hard part. Talk through the highest and lowest votes. Ask the hard
          questions to flag uncertainties, dependencies earlier. <br />
          <strong>And start another session for the next task.</strong>
        </HowToUseCard>
      </ol>
    </section>
  );
}
