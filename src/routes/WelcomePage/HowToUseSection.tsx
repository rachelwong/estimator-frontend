import cardBack from '@/assets/sprites/cardback.svg'
import cardFace from '@/assets/sprites/cardface.svg'
import laptop from '@/assets/sprites/laptop.svg'
import personFour from '@/assets/sprites/p4.svg'
import {
  WELCOME_ANCHOR_CLASS,
  WELCOME_GUTTER_CLASS,
  WELCOME_SECTION_HEADING_CLASS,
  WelcomeSection,
} from '@/constants'
import { cn } from '@/lib/utils'
import { HowToUseCard } from './HowToUseCard'

// Four cards, LV.1 to LV.4, one per step of a Session (§7 item 5): four across
// on desktop, two on tablet, one on a phone. Written out rather than mapped
// from a table — each card's sprite and tint are its own.
export function HowToUseSection() {
  return (
    <section
      id={WelcomeSection.HOW_TO_USE}
      className={cn('flex flex-col gap-7 pt-8 tablet:gap-10 tablet:pt-12', WELCOME_GUTTER_CLASS, WELCOME_ANCHOR_CLASS)}
    >
      <h2 className={cn(WELCOME_SECTION_HEADING_CLASS, 'text-center')}>How to use</h2>

      <ol className="grid gap-5 tablet:grid-cols-2 tablet:gap-7 desktop:grid-cols-4">
        <HowToUseCard level={1} title="Start a session" sprite={laptop} tintClass="bg-white">
          Choose a Point system, Numerical or Fibonacci, set the highest axis value and share the
          link.
        </HowToUseCard>
        <HowToUseCard level={2} title="Pull up a chair" sprite={personFour} tintClass="bg-butter">
          Everyone joins with just a name. No accounts, nothing to install.
        </HowToUseCard>
        <HowToUseCard level={3} title="Hands down" sprite={cardBack} tintClass="bg-copied">
          Pick a Square. Pick another to move it, or the same one to clear it. Nobody else can see
          it.
        </HowToUseCard>
        <HowToUseCard level={4} title="The Reveal" sprite={cardFace} tintClass="bg-crowd-0">
          The Admin ends the session. Every Square shows who landed there; anyone without a
          Selection is Abstained.
        </HowToUseCard>
      </ol>
    </section>
  )
}
