import {
  WELCOME_ANCHOR_CLASS,
  WELCOME_GUTTER_CLASS,
  WELCOME_SECTION_HEADING_CLASS,
  WelcomeSection,
} from '@/constants'
import { cn } from '@/lib/utils'
import { RevealComparison } from './RevealComparison'
import { SelectionDemo } from './SelectionDemo'

// Why keep Selections private? (§7 item 6): the argument, then the running grid
// and the Reveal side by side on desktop, stacked on tablet and a phone. Both
// are the real grid, so the one on the left takes a click and the one on the
// right opens its popovers.
export function WhyPrivateSection() {
  return (
    <section
      id={WelcomeSection.WHY_PRIVATE}
      className={cn('flex flex-col gap-7 pt-20 tablet:gap-10 tablet:pt-[120px]', WELCOME_GUTTER_CLASS, WELCOME_ANCHOR_CLASS)}
    >
      <div className="flex flex-col gap-4 tablet:gap-8 desktop:flex-row desktop:items-end desktop:justify-between">
        <h2 className={cn(WELCOME_SECTION_HEADING_CLASS, 'max-w-[640px]')}>Why keep Selections private?</h2>
        <p className="max-w-[520px] text-[16px] leading-[1.55] text-text-muted tablet:text-[18px]">
          The first number said out loud tends to become everyone’s number. Private Selections mean
          each person commits to their own read, and the Reveal puts the disagreement where the team
          can point at it.
        </p>
      </div>

      <div className="grid items-start gap-7 tablet:gap-10 desktop:grid-cols-2">
        <SelectionDemo />
        <RevealComparison />
      </div>
    </section>
  )
}
