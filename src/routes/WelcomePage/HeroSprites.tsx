import speechBubble from '@/assets/sprites/bubble.svg'
import speechBubbleQuestion from '@/assets/sprites/bubbleq.svg'
import mug from '@/assets/sprites/mug.svg'
import note from '@/assets/sprites/note.svg'
import personFour from '@/assets/sprites/p4.svg'
import personSix from '@/assets/sprites/p6.svg'
import personThree from '@/assets/sprites/p3.svg'
import plant from '@/assets/sprites/plant.svg'
import { Sprite } from '@/components/Sprite'
import { SPRITE_SCATTER_CLASS } from '@/constants'
import { cn } from '@/lib/utils'

// The cast around the hero's words (§9), placed off the three artboards. A
// phone and a tablet get a mug and a speech bubble in the top corners; desktop
// moves those two in among four more stickers and a character each side.
//
// Behind the words, as everywhere, and deaf to the pointer.
export function HeroSprites() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <Sprite
        source={mug}
        className="sprite-sticker absolute top-1 left-2 h-[37px] w-auto rotate-[-8deg] tablet:top-2.5 tablet:left-6 tablet:h-[50px] desktop:top-[250px] desktop:left-[290px] desktop:h-[65px] desktop:rotate-[8deg]"
      />
      <Sprite
        source={speechBubble}
        className="sprite-sticker absolute top-0 right-3 h-8 w-auto rotate-[6deg] tablet:top-1.5 tablet:right-[42px] tablet:h-[42px] desktop:right-auto desktop:left-[180px] desktop:h-[49px] desktop:rotate-[5deg]"
      />

      <Sprite
        source={personFour}
        className={cn(SPRITE_SCATTER_CLASS.HIDDEN_BELOW_DESKTOP, 'sprite-sticker absolute top-10 left-[110px] h-[138px] w-auto rotate-[-7deg]')}
      />
      <Sprite
        source={note}
        className={cn(SPRITE_SCATTER_CLASS.HIDDEN_BELOW_DESKTOP, 'sprite-sticker absolute top-[330px] left-[110px] h-[62px] w-auto rotate-[-6deg]')}
      />
      <Sprite
        source={personThree}
        className={cn(SPRITE_SCATTER_CLASS.HIDDEN_BELOW_DESKTOP, 'sprite-sticker absolute top-10 right-[116px] h-[138px] w-auto rotate-[6deg]')}
      />
      <Sprite
        source={speechBubbleQuestion}
        className={cn(SPRITE_SCATTER_CLASS.HIDDEN_BELOW_DESKTOP, 'sprite-sticker absolute -top-1.5 right-[78px] h-[54px] w-auto rotate-[-5deg]')}
      />
      <Sprite
        source={plant}
        className={cn(SPRITE_SCATTER_CLASS.HIDDEN_BELOW_DESKTOP, 'sprite-sticker absolute top-[250px] right-[250px] h-[74px] w-auto rotate-[5deg]')}
      />
      <Sprite
        source={personSix}
        className={cn(SPRITE_SCATTER_CLASS.HIDDEN_BELOW_DESKTOP, 'sprite-sticker absolute top-[300px] right-[90px] h-[131px] w-auto rotate-[-4deg]')}
      />
    </div>
  )
}
