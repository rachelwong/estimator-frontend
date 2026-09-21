import laptop from '@/assets/sprites/laptop.svg'
import server from '@/assets/sprites/server.svg'
import {
  REPOSITORY_URL,
  WELCOME_ANCHOR_CLASS,
  WELCOME_GUTTER_CLASS,
  WELCOME_SECTION_HEADING_CLASS,
  WelcomeSection,
} from '@/constants'
import { cn } from '@/lib/utils'
import { PlaceholderCopy } from './PlaceholderCopy'
import { RepositoryCard } from './RepositoryCard'

// Why I made this (§7 item 6): a note, and a card for each repo. The note sits
// left of the cards on desktop; on tablet the cards go side by side beneath it,
// and on a phone everything stacks.
export function WhyIMadeThisSection() {
  return (
    <section
      id={WelcomeSection.WHY_I_MADE_THIS}
      className={cn(
        'grid gap-8 pt-20 tablet:gap-9 tablet:pt-[110px] desktop:grid-cols-12 desktop:items-start',
        WELCOME_GUTTER_CLASS,
        WELCOME_ANCHOR_CLASS,
      )}
    >
      <div className="flex flex-col gap-[18px] desktop:col-span-7">
        <h2 className={WELCOME_SECTION_HEADING_CLASS}>Why I made this</h2>

        <p className="text-[16px] leading-[1.6] text-text-muted tablet:text-[18px]">
          <PlaceholderCopy>
            [Placeholder: what kept going wrong in estimation meetings. For example, one loud number
            setting the tone for the whole team.]
          </PlaceholderCopy>
        </p>
        <p className="text-[16px] leading-[1.6] text-text-muted tablet:text-[18px]">
          <PlaceholderCopy>
            [Placeholder: what you wanted to try instead. Two axes, private picks, and a Reveal the
            team can point at.]
          </PlaceholderCopy>
        </p>
        <p className="text-[16px] leading-[1.6] text-text-muted tablet:text-[18px]">
          <PlaceholderCopy>
            [Placeholder: what you were learning or showing off along the way, like real-time sockets
            or a Node backend.]
          </PlaceholderCopy>
        </p>
        <p className="text-[16px] font-bold">
          <PlaceholderCopy>— [Your name], [your role]</PlaceholderCopy>
        </p>
      </div>

      <div className="grid gap-5 tablet:grid-cols-2 tablet:gap-6 desktop:col-span-4 desktop:col-start-9 desktop:grid-cols-1">
        <RepositoryCard
          name="estimator-frontend"
          description="The interface you’re looking at: grid, Area, Reveal."
          sprite={laptop}
          url={REPOSITORY_URL.FRONTEND}
          buttonVariant="default"
        />
        <RepositoryCard
          name="estimator-backend"
          description="Sessions in memory, REST for the Reveal, Socket.IO for everything live."
          sprite={server}
          url={REPOSITORY_URL.BACKEND}
          buttonVariant="secondary"
        />
      </div>
    </section>
  )
}
