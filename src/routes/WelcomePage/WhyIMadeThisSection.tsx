import { Button } from "@/components/ui/button";
import { REPOSITORY_URL, WelcomeSection } from "@/constants";
import { CodeIcon } from "./CodeIcon";
import { MakerNote } from "./MakerNote";
import { WelcomeSectionHeading } from "./WelcomeSectionHeading";

// Why I made this (§7 item 6), a zine spread: the heading on an ink rule, three
// notes split by ink rules, then a "read the source" bar with the sign-off and
// both repos. Desktop runs the notes in three columns; tablet puts the problem
// and the idea side by side with the build across the bottom; a phone stacks
// everything.
export function WhyIMadeThisSection() {
  return (
    <section
      id={WelcomeSection.WHY_I_MADE_THIS}
      className="flex flex-col gap-7 px-5 pt-20 scroll-mt-16 tablet:gap-8 tablet:px-10 tablet:pt-[110px] tablet:scroll-mt-[72px] desktop:gap-9 desktop:px-20 desktop:scroll-mt-[84px]"
    >
      <div className="pb-3.5 tablet:pb-4 desktop:pb-[18px]">
        <WelcomeSectionHeading text="Why I made this" />
      </div>

      <div className="grid gap-7 tablet:grid-cols-2 tablet:gap-0 desktop:grid-cols-3">
        <MakerNote
          label="the experience"
          text="This side project was inspired by the agile ceremonies, ideation workshops and stand-ups I've been part of at work. Estimation is hard, yet many decisions that shape a product team hinge upon it.
<br/><br/>
In my experience, a few things make estimates less reliable:<br/>
<ul className='list-disc my-2 pl-4'>
<li>tasks scoped too large or too ambitiously</li>
<li>scope creep</li>
<li>the first number called out becomes the answer</li>
<li>the same voices every sprint planning</li>
<li>not all stakeholders are in the room</li>
<li>not everyone feels able to contribute or ask questions</li>
</ul>
"
          className="tablet:border-r-2 tablet:border-ink tablet:pr-7 tablet:pb-7 desktop:pr-9 desktop:pb-0"
        />
        <MakerNote
          label="the idea"
          text="There's plenty of formal literature on <a href='https://agilemanifesto.org/' target='_blank' className='link'>agile</a>, <a className='link' href='https://www.atlassian.com/blog/developers/planning-poker-sane-healthy' target='_blank'>estimation</a> and <a className='link' href='https://www.atlassian.com/agile/scrum' target='_blank'>Scrum</a>. I deliberately avoided reading those or referring to existing estimation tools on the market, because I wanted to build something that addressed what I'd personally observed in previous teams.
<br/><br/>
I want to create a tool that invites every team member to contribute visibly and meaningfully to estimating, makes room for discussion when it's needed, and brings everyone into alignment. A story point is a good-faith rough estimate, not a binding guarantee."
          className="tablet:pb-7 tablet:pl-7 desktop:border-r-2 desktop:border-ink desktop:px-9 desktop:pb-0"
        />
        <MakerNote
          label="the build"
          text="
          I used this project to explore two things I'd shelved for 'later': back-end development and Claude Code. I've documented my process in detail in each repo's README. In a nutshell, I seeded the project with a <a className='link' href='https://miro.com/app/board/uXjVH-RcLGw=/?share_link_id=902798596342'>Miro board of storyboards</a> and a <a className='link' href='https://app.notion.com/p/rachelwong/Estimator-3bb375d34b3480548d26edd98dcc8a11?source=copy_link'>Notion doc</a>. I've used interview-style prompts and <a href='https://github.com/mattpocock/skills' className='link'>Matt Pocock's grilling skills</a>. Each stage is effectively a pull request: I review it, make manual changes, grill it, and commit manually. And make more manual changes for code quality. <br /><br/>Claude-driven design can be fun, but I would still reach for a human designer for good taste. 
I haven't yet figured out the best way to use AI; still to come.
          "
          className="tablet:col-span-2 tablet:border-t-2 tablet:border-ink tablet:pt-7 desktop:col-span-1 desktop:border-t-0 desktop:pt-0 desktop:pl-9"
        />
      </div>

      <div className="flex flex-col gap-[18px] border-[3px] border-ink bg-white p-[18px] shadow-px-card tablet:px-[22px] tablet:py-5 desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-6 desktop:py-[18px]">
        <div className="flex flex-col">
          <span className="font-label text-[12px] mb-1.5">
            the tools & process
          </span>
          <span className="text-[16px] font-bold">
            Front-end: React, TypeScript, TailwindCSS, Socket.io, Playwright,
            Vercel
          </span>
          <span className="text-[16px] font-bold">
            Back-end: Node.js, TypeScript, Websockets, Render
          </span>
          <span className="text-[16px] font-bold">AI: Claude Code</span>
        </div>

        <div className="grid gap-3.5 tablet:grid-cols-2 tablet:gap-4 desktop:flex">
          <Button
            asChild
            className="h-[52px] w-full text-[16px] desktop:w-auto desktop:px-[22px]"
          >
            <a href={REPOSITORY_URL.FRONTEND} target="_blank">
              <CodeIcon />
              Frontend on GitHub
            </a>
          </Button>
          <Button
            asChild
            variant="secondary"
            className="h-[52px] w-full text-[16px] desktop:w-auto desktop:px-[22px]"
          >
            <a href={REPOSITORY_URL.BACKEND} target="_blank">
              <CodeIcon />
              Backend on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
