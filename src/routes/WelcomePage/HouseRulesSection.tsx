import cardFace from '@/assets/sprites/cardface.svg'
import coins from '@/assets/sprites/coins.svg'
import hourglass from '@/assets/sprites/hourglass.svg'
import laptop from '@/assets/sprites/laptop.svg'
import note from '@/assets/sprites/note.svg'
import avatarTwo from '@/assets/sprites/avatar2.svg'
import { WELCOME_GUTTER_CLASS, WELCOME_SECTION_HEADING_CLASS } from '@/constants'
import { cn } from '@/lib/utils'
import { HouseRule } from './HouseRule'

// House rules (§7 item 7): six things worth knowing before a first Session.
// Three across on desktop, two on tablet, one on a phone.
export function HouseRulesSection() {
  return (
    <section className={cn('flex flex-col gap-6 pt-20 tablet:gap-9 tablet:pt-[110px]', WELCOME_GUTTER_CLASS)}>
      <h2 className={cn(WELCOME_SECTION_HEADING_CLASS, 'text-center')}>House rules</h2>

      <ul className="grid gap-4 tablet:grid-cols-2 tablet:gap-6 desktop:grid-cols-3">
        <HouseRule
          sprite={laptop}
          title="Live, but private"
          description="The session updates in real time, but nobody sees a Selection until the Reveal."
        />
        <HouseRule sprite={avatarTwo} title="No sign-up" description="Open the link and type a name. That’s the whole join." />
        <HouseRule
          sprite={note}
          title="One link per session"
          description="Every new session gets its own link. Share it wherever your team talks."
        />
        <HouseRule
          sprite={hourglass}
          title="Change your mind"
          description="Pick another Square to move your Selection, or the same one to clear it."
        />
        <HouseRule
          sprite={coins}
          title="Two axes, one grid"
          description="Time and Resources share the same Axis values, so the grid is always square."
        />
        <HouseRule sprite={cardFace} title="Nothing is kept" description="Sessions live in memory. No accounts, no history." />
      </ul>
    </section>
  )
}
