import speechBubbleQuestion from '@/assets/sprites/bubbleq.svg'
import cardBack from '@/assets/sprites/cardback.svg'
import coins from '@/assets/sprites/coins.svg'
import personFour from '@/assets/sprites/p4.svg'
import personThree from '@/assets/sprites/p3.svg'
import personTwo from '@/assets/sprites/p2.svg'
import { Sprite } from '@/components/Sprite'
import { SPRITE_SCATTER_CLASS } from '@/constants'
import { cn } from '@/lib/utils'

// The cast around the hero's Reveal window (§9), off the three artboards.
//
//   mobile   two characters peeking over the window's top edge
//   tablet   the same pair taller, each with a sticker above
//   desktop  a character and a sticker floating out beside each side
export function DemoSprites() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <Sprite
        source={personFour}
        className={cn(SPRITE_SCATTER_CLASS.HIDDEN_ON_DESKTOP, 'sprite-sticker absolute top-1 left-0.5 h-[82px] w-auto rotate-[-5deg] tablet:-top-[60px] tablet:left-2 tablet:h-[105px]')}
      />
      <Sprite
        source={personThree}
        className="sprite-sticker absolute top-1.5 right-1 h-[82px] w-auto rotate-[5deg] tablet:-top-14 tablet:right-3 tablet:h-[105px] desktop:top-[260px] desktop:right-11 desktop:h-[125px]"
      />
      <Sprite
        source={speechBubbleQuestion}
        className={cn(SPRITE_SCATTER_CLASS.TABLET_ONLY, 'sprite-sticker absolute -top-[100px] left-14 h-10 w-auto rotate-[4deg]')}
      />
      <Sprite
        source={cardBack}
        className={cn(SPRITE_SCATTER_CLASS.HIDDEN_BELOW_TABLET, 'sprite-sticker absolute -top-[110px] right-[60px] h-[41px] w-auto rotate-[-10deg] desktop:top-[180px] desktop:right-auto desktop:left-[110px] desktop:h-[53px] desktop:rotate-[12deg]')}
      />
      <Sprite
        source={personTwo}
        className={cn(SPRITE_SCATTER_CLASS.HIDDEN_BELOW_DESKTOP, 'sprite-sticker absolute top-[240px] left-10 h-[125px] w-auto rotate-[-5deg]')}
      />
      <Sprite
        source={coins}
        className={cn(SPRITE_SCATTER_CLASS.HIDDEN_BELOW_DESKTOP, 'sprite-sticker absolute top-[170px] right-[58px] h-[44px] w-auto rotate-[-6deg]')}
      />
    </div>
  )
}
