import coins from '@/assets/sprites/coins.svg'
import cooler from '@/assets/sprites/cooler.svg'
import hourglass from '@/assets/sprites/hourglass.svg'
import laptop from '@/assets/sprites/laptop.svg'
import mug from '@/assets/sprites/mug.svg'
import note from '@/assets/sprites/note.svg'
import personFive from '@/assets/sprites/p5.svg'
import personFour from '@/assets/sprites/p4.svg'
import personOne from '@/assets/sprites/p1.svg'
import personTwo from '@/assets/sprites/p2.svg'
import plant from '@/assets/sprites/plant.svg'
import server from '@/assets/sprites/server.svg'
import speechBubbleQuestion from '@/assets/sprites/bubbleq.svg'
import { Sprite } from '@/components/Sprite'
import { SPRITE_SCATTER_CLASS } from '@/constants'
import { cn } from '@/lib/utils'

interface SpriteScatterProps {
  className?: string
}

// The decorative cast around the main window (DESIGN.md §9).
//
//   mobile   two characters peeking over the top edge only
//   tablet   + props leaning out of the left and right sides
//   desktop  + the rest, floating around all four edges
//
// Positions are written out rather than driven from a table: each one is
// bespoke to its sprite and its edge, so a table would only spread one
// placement across two files.
//
// The layer is absolutely positioned inside the nearest positioned ancestor and
// pinned behind with a negative z-index, so the window always sits on top (§9).
// `pointer-events-none` stops a character swallowing a click meant for the grid.
export function SpriteScatter({ className }: SpriteScatterProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}
    >
      {/* Peeking over the top edge — the only pair mobile shows. */}
      <Sprite
        source={personOne}
        className="absolute -top-4 left-[6%] h-28 w-auto rotate-[-5deg] tablet:h-36 desktop:h-44"
      />
      <Sprite
        source={personFour}
        className="absolute -top-6 right-[8%] h-28 w-auto rotate-[4deg] tablet:h-36 desktop:h-44"
      />

      {/* Leaning out of the sides, from tablet up. */}
      <Sprite
        source={mug}
        className={cn(
          SPRITE_SCATTER_CLASS.HIDDEN_BELOW_TABLET,
          'absolute top-[28%] -left-6 h-16 w-auto rotate-[-7deg] desktop:h-20',
        )}
      />
      <Sprite
        source={plant}
        className={cn(
          SPRITE_SCATTER_CLASS.HIDDEN_BELOW_TABLET,
          'absolute top-[22%] -right-5 h-20 w-auto rotate-[6deg] desktop:h-24',
        )}
      />
      <Sprite
        source={speechBubbleQuestion}
        className={cn(
          SPRITE_SCATTER_CLASS.HIDDEN_BELOW_TABLET,
          'absolute bottom-[18%] -left-4 h-16 w-auto rotate-[5deg] desktop:h-20',
        )}
      />

      {/* The full ring of edge decoration, desktop only. */}
      <Sprite
        source={laptop}
        className={cn(
          SPRITE_SCATTER_CLASS.HIDDEN_BELOW_DESKTOP,
          'absolute bottom-[8%] left-[4%] h-20 w-auto rotate-[-4deg]',
        )}
      />
      <Sprite
        source={server}
        className={cn(
          SPRITE_SCATTER_CLASS.HIDDEN_BELOW_DESKTOP,
          'absolute bottom-[10%] right-[5%] h-24 w-auto rotate-[3deg]',
        )}
      />
      <Sprite
        source={coins}
        className={cn(
          SPRITE_SCATTER_CLASS.HIDDEN_BELOW_DESKTOP,
          'absolute top-[52%] -left-8 h-16 w-auto rotate-[8deg]',
        )}
      />
      <Sprite
        source={note}
        className={cn(
          SPRITE_SCATTER_CLASS.HIDDEN_BELOW_DESKTOP,
          'absolute top-[62%] -right-7 h-16 w-auto rotate-[-6deg]',
        )}
      />
      <Sprite
        source={hourglass}
        className={cn(
          SPRITE_SCATTER_CLASS.HIDDEN_BELOW_DESKTOP,
          'absolute top-[10%] left-[1%] h-20 w-auto rotate-[-3deg]',
        )}
      />
      <Sprite
        source={cooler}
        className={cn(
          SPRITE_SCATTER_CLASS.HIDDEN_BELOW_DESKTOP,
          'absolute top-[8%] right-[2%] h-24 w-auto rotate-[5deg]',
        )}
      />
      <Sprite
        source={personTwo}
        className={cn(
          SPRITE_SCATTER_CLASS.HIDDEN_BELOW_DESKTOP,
          'absolute -bottom-4 left-[26%] h-40 w-auto rotate-[4deg]',
        )}
      />
      <Sprite
        source={personFive}
        className={cn(
          SPRITE_SCATTER_CLASS.HIDDEN_BELOW_DESKTOP,
          'absolute -bottom-6 right-[24%] h-40 w-auto rotate-[-5deg]',
        )}
      />
    </div>
  )
}
