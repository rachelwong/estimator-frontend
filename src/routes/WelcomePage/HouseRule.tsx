import { Card } from '@/components/Card'
import { Sprite } from '@/components/Sprite'

interface HouseRuleProps {
  /** A `.svg` imported from `@/assets/sprites`. */
  sprite: string
  title: string
  description: string
}

// One house rule: a sprite beside a bold line and a sentence. A Card's edge
// without its shadow, as the artboard draws it — flatter than the How to play
// cards above, so the six read as a list rather than six more steps.
export function HouseRule({ sprite, title, description }: HouseRuleProps) {
  return (
    <li className="flex">
      <Card className="flex w-full items-start gap-[18px] p-[22px] shadow-none tablet:p-[22px] desktop:p-[22px]">
        <Sprite source={sprite} className="h-auto w-12 shrink-0" />

        <div className="flex flex-col gap-1.5">
          <strong className="text-[18px]">{title}</strong>
          <p className="text-[15px] leading-[1.55] text-text-muted">{description}</p>
        </div>
      </Card>
    </li>
  )
}
