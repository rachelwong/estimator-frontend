import bug from '@/assets/sprites/bug.svg'
import { Sprite } from '@/components/Sprite'
import { REPOSITORY_URL } from '@/constants'
import { useContent } from '@/hooks'
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
  const content = useContent()

  return (
    <span className="group relative inline-flex">
      <a
        href={REPOSITORY_URL.LINKEDIN}
        target="_blank"
        aria-label={content.feedback.label}
        className="inline-flex h-11 w-11 items-center justify-center border-[3px] border-ghost-border bg-secondary shadow-icon outline-none focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <Sprite
          source={bug}
          className="w-[22px] animate-feedback-shake group-hover:animate-feedback-pop group-focus-within:animate-feedback-pop"
        />
      </a>

      <FeedbackConfetti />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-full left-1/2 z-10 hidden -translate-x-1/2 translate-y-3 rounded-control bg-inverse px-[9px] py-1.5 font-label text-[11px] whitespace-nowrap text-inverse-foreground group-hover:block group-focus-within:block"
      >
        {content.feedback.label}
      </span>
    </span>
  )
}
