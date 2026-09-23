import bug from '@/assets/sprites/bug.svg'
import { Sprite } from '@/components/Sprite'
import { REPOSITORY_URL } from '@/constants'
import { FeedbackConfetti } from './FeedbackConfetti'

// The header's Feedback tile (artboard "Nav bug button", option D6). A 44px
// white tile carrying the pixel bug, opening LinkedIn in a new tab — the bug is
// what the tile says, and LinkedIn is where a message actually reaches me.
//
// At rest the bug flicks once every 13s. On hover or focus the tile itself
// stays put while the bug bursts into pixel confetti and pops back, and the
// label appears beneath: the burst is the whole gesture, so lifting the tile
// as well would be two animations fighting over one hover.
//
// Reduced motion switches all of it off through the global rule in index.css,
// which leaves a still tile, its label and a working link.
//
// The label is only ever decoration — the link carries the same word as its
// accessible name, so a screen reader hears it once rather than twice.
export function FeedbackButton() {
  return (
    <span className="group relative inline-flex">
      <a
        href={REPOSITORY_URL.LINKEDIN}
        target="_blank"
        aria-label="Feedback"
        className="inline-flex h-11 w-11 items-center justify-center border-[3px] border-ink bg-white shadow-[3px_3px_0_var(--color-ink)] outline-none focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        <Sprite
          source={bug}
          className="w-[22px] animate-feedback-shake group-hover:animate-feedback-pop group-focus-within:animate-feedback-pop"
        />
      </a>

      <FeedbackConfetti />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-full left-1/2 z-10 hidden -translate-x-1/2 translate-y-3 bg-ink px-[9px] py-1.5 font-label text-[11px] whitespace-nowrap text-cream group-hover:block group-focus-within:block"
      >
        Feedback
      </span>
    </span>
  )
}
