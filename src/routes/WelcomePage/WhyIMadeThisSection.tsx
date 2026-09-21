import { Button } from '@/components/ui/button'
import {
  REPOSITORY_URL,
  WELCOME_ANCHOR_CLASS,
  WELCOME_GUTTER_CLASS,
  WELCOME_SECTION_HEADING_CLASS,
  WelcomeSection,
} from '@/constants'
import { cn } from '@/lib/utils'
import { CodeIcon } from './CodeIcon'
import { MakerNote } from './MakerNote'
import { PlaceholderCopy } from './PlaceholderCopy'

// Why I made this (§7 item 6), a zine spread: the heading on an ink rule, three
// notes split by ink rules, then a "read the source" bar with the sign-off and
// both repos. Desktop runs the notes in three columns; tablet puts the problem
// and the idea side by side with the build across the bottom; a phone stacks
// everything.
export function WhyIMadeThisSection() {
  return (
    <section
      id={WelcomeSection.WHY_I_MADE_THIS}
      className={cn(
        'flex flex-col gap-7 pt-20 tablet:gap-8 tablet:pt-[110px] desktop:gap-9',
        WELCOME_GUTTER_CLASS,
        WELCOME_ANCHOR_CLASS,
      )}
    >
      <div className="flex flex-col gap-2.5 border-b-[3px] border-ink pb-3.5 tablet:flex-row tablet:flex-wrap tablet:items-end tablet:justify-between tablet:gap-x-6 tablet:gap-y-3 tablet:pb-4 desktop:pb-[18px]">
        <h2 className={WELCOME_SECTION_HEADING_CLASS}>Why I made this</h2>
        <span className="font-label text-[12px] tablet:pb-1.5">notes from the maker</span>
      </div>

      <div className="grid gap-7 tablet:grid-cols-2 tablet:gap-0 desktop:grid-cols-3">
        <MakerNote
          label="the problem"
          text="[Placeholder: what kept going wrong in estimation meetings. For example, one loud number setting the tone for the whole team.]"
          className="tablet:border-r-2 tablet:border-ink tablet:pr-7 tablet:pb-7 desktop:pr-9 desktop:pb-0"
        />
        <MakerNote
          label="the idea"
          text="[Placeholder: what you wanted to try instead. Two axes, private picks, and a Reveal the team can point at.]"
          className="tablet:pb-7 tablet:pl-7 desktop:border-r-2 desktop:border-ink desktop:px-9 desktop:pb-0"
        />
        <MakerNote
          label="the build"
          text="[Placeholder: what you were learning or showing off along the way, like real-time sockets or a Node backend.]"
          className="tablet:col-span-2 tablet:border-t-2 tablet:border-ink tablet:pt-7 desktop:col-span-1 desktop:border-t-0 desktop:pt-0 desktop:pl-9"
        />
      </div>

      <div className="flex flex-col gap-[18px] border-[3px] border-ink bg-white p-[18px] shadow-px-card tablet:px-[22px] tablet:py-5 desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-6 desktop:py-[18px]">
        <div className="flex flex-col gap-1.5">
          <span className="font-label text-[12px]">read the source</span>
          <span className="text-[16px] font-bold">
            <PlaceholderCopy>— [Your name], [your role]</PlaceholderCopy>
          </span>
        </div>

        <div className="grid gap-3.5 tablet:grid-cols-2 tablet:gap-4 desktop:flex">
          <Button asChild className="h-[52px] w-full text-[16px] desktop:w-auto desktop:px-[22px]">
            <a href={REPOSITORY_URL.FRONTEND}>
              <CodeIcon />
              Frontend on GitHub
            </a>
          </Button>
          <Button asChild variant="secondary" className="h-[52px] w-full text-[16px] desktop:w-auto desktop:px-[22px]">
            <a href={REPOSITORY_URL.BACKEND}>
              <CodeIcon />
              Backend on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
