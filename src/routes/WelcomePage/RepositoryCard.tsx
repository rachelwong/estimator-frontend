import type { ComponentProps } from 'react'
import { Card } from '@/components/Card'
import { Sprite } from '@/components/Sprite'
import { Button } from '@/components/ui/button'
import { CodeIcon } from './CodeIcon'

interface RepositoryCardProps {
  /** The repo's own name — the Welcome cards name them literally (§7 item 7). */
  name: string
  description: string
  /** A `.svg` imported from `@/assets/sprites`. */
  sprite: string
  url: string
  /** The first card's button is yellow, the second's white. */
  buttonVariant: ComponentProps<typeof Button>['variant']
}

// One repo on `page-top` lavender: a sprite, the repo's name in Silkscreen, a
// line about it, and a full-width View on GitHub.
//
// Both buttons read "View on GitHub", so each carries its repo's name for a
// screen reader, which would otherwise hear two identical links.
export function RepositoryCard({ name, description, sprite, url, buttonVariant }: RepositoryCardProps) {
  return (
    <Card className="flex flex-col gap-4 bg-page-top p-[18px] tablet:p-[22px] desktop:p-[22px]">
      <div className="flex items-center gap-3.5">
        <Sprite source={sprite} className="h-auto w-11 shrink-0 tablet:w-[52px]" />

        <div className="flex flex-col gap-1">
          <span className="font-label text-[12px]">{name}</span>
          <p className="text-[15px] leading-[1.45]">{description}</p>
        </div>
      </div>

      <Button asChild variant={buttonVariant} className="h-[52px] w-full text-[16px]">
        <a href={url}>
          <CodeIcon />
          View<span className="sr-only"> {name}</span> on GitHub
        </a>
      </Button>
    </Card>
  )
}
