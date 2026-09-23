import type { CSSProperties } from 'react'
import { FEEDBACK_CONFETTI_PIECES } from '@/constants'

// The burst behind the header's Feedback tile (artboard "Nav bug button",
// option D6): fourteen pixels thrown out of the bug, turning as they go.
//
// Every piece is square, centred on the tile by its own half-width, and hands
// its trajectory to the shared keyframe as custom properties — so all fourteen
// run one animation rather than fourteen. Decorative, and the tile beside them
// already carries the label, so none of it reaches the accessibility tree.
export function FeedbackConfetti() {
  return (
    <>
      {FEEDBACK_CONFETTI_PIECES.map((piece) => (
        <span
          key={`${piece.x},${piece.y}`}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 opacity-0 group-hover:animate-feedback-confetti group-focus-within:animate-feedback-confetti"
          style={
            {
              width: piece.size,
              height: piece.size,
              margin: `${-piece.size / 2}px 0 0 ${-piece.size / 2}px`,
              background: piece.color,
              '--confetti-x': `${piece.x}px`,
              '--confetti-y': `${piece.y}px`,
              '--confetti-turn': `${piece.turn}deg`,
            } as CSSProperties
          }
        />
      ))}
    </>
  )
}
