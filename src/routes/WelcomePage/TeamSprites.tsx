import speechBubble from '@/assets/sprites/bubble.svg'
import speechBubbleQuestion from '@/assets/sprites/bubbleq.svg'
import mug from '@/assets/sprites/mug.svg'
import personFour from '@/assets/sprites/p4.svg'
import personSix from '@/assets/sprites/p6.svg'
import personThree from '@/assets/sprites/p3.svg'
import personTwo from '@/assets/sprites/p2.svg'
import { Sprite } from '@/components/Sprite'
import { SPRITE_SCATTER_CLASS } from '@/constants'
import { cn } from '@/lib/utils'

interface TeamSpritesProps {
  isGathered: boolean
}

// The team in the closing band (§7 item 8), off the three artboards. Anchored
// to the right edge so they stay clear of the words at any width; three stand
// on every size, and desktop adds a fourth with a second bubble and a mug.
//
// Behind the words, and cut off by the band's frame where they run past it.
// Until the band is in view they wait below its bottom edge (a fixed distance
// taller than the band, so even the high bubbles start out of sight); once
// gathered they slide up, staggered so the crowd arrives one by one, and stay.
export function TeamSprites({ isGathered }: TeamSpritesProps) {
  const arrival = cn('transition-transform duration-500 ease-out', !isGathered && 'translate-y-[360px]')

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <Sprite
        source={personTwo}
        className={cn(arrival, 'delay-100', 'sprite-sticker absolute top-[220px] right-[138px] h-[92px] w-auto rotate-[4deg] tablet:top-[250px] tablet:right-[238px] tablet:h-[115px] desktop:top-[150px] desktop:right-[290px] desktop:h-[138px]')}
      />
      <Sprite
        source={speechBubble}
        className={cn(arrival, 'delay-500', 'sprite-sticker absolute top-[180px] right-[104px] h-8 w-auto rotate-[4deg] tablet:right-[98px] tablet:h-[41px] desktop:top-[60px] desktop:right-[366px] desktop:h-[47px]')}
      />
      <Sprite
        source={personSix}
        className={cn(arrival, 'delay-200', 'sprite-sticker absolute top-[212px] right-12 h-[92px] w-auto rotate-[-3deg] tablet:top-[230px] tablet:right-[138px] tablet:h-[115px] desktop:top-[110px] desktop:right-[170px] desktop:h-[138px]')}
      />
      <Sprite
        source={personThree}
        className={cn(arrival, 'delay-0', 'sprite-sticker absolute top-[226px] -right-3 h-[92px] w-auto rotate-[5deg] tablet:top-[260px] tablet:right-[38px] tablet:h-[115px] desktop:top-40 desktop:right-[50px] desktop:h-[138px]')}
      />

      <Sprite
        source={personFour}
        className={cn(SPRITE_SCATTER_CLASS.HIDDEN_BELOW_DESKTOP, arrival, 'delay-300', 'sprite-sticker absolute top-[120px] right-[410px] h-[138px] w-auto rotate-[-6deg]')}
      />
      <Sprite
        source={speechBubbleQuestion}
        className={cn(SPRITE_SCATTER_CLASS.HIDDEN_BELOW_DESKTOP, arrival, 'delay-700', 'sprite-sticker absolute top-[50px] right-[134px] h-[52px] w-auto rotate-[-6deg]')}
      />
      <Sprite
        source={mug}
        className={cn(SPRITE_SCATTER_CLASS.HIDDEN_BELOW_DESKTOP, arrival, 'delay-[600ms]', 'sprite-sticker absolute top-[90px] -right-8 h-[52px] w-auto rotate-[10deg]')}
      />
    </div>
  )
}
