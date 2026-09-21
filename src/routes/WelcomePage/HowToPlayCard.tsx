import type { ReactNode } from 'react'
import { Card } from '@/components/Card'
import { Sprite } from '@/components/Sprite'
import { WELCOME_CARD_HEADING_CLASS } from '@/constants'
import { cn } from '@/lib/utils'

interface HowToPlayCardProps {
  level: number
  title: string
  /** A `.svg` imported from `@/assets/sprites`. */
  sprite: string
  /** The card's fill — one of the four How to play tints (§2). */
  tintClass: string
  children: ReactNode
}

// One step of How to play (§7 item 5): an ink "LV.n" tag and a sprite across
// the top, then the step's name and a sentence about it.
export function HowToPlayCard({ level, title, sprite, tintClass, children }: HowToPlayCardProps) {
  return (
    <li className="flex">
      <Card className={cn('flex w-full flex-col gap-3.5', tintClass)}>
        <div className="flex items-start justify-between">
          <span className="bg-ink px-2 py-1 font-label text-[13px] text-cream">LV.{level}</span>
          <Sprite source={sprite} className="h-auto w-[52px] tablet:w-16" />
        </div>

        <h3 className={WELCOME_CARD_HEADING_CLASS}>{title}</h3>
        <p className="text-[16px] leading-[1.55] text-text-muted">{children}</p>
      </Card>
    </li>
  )
}
