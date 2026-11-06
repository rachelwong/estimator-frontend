import chevronRight from '@/assets/sprites/work/chevron-right.svg'
import external from '@/assets/sprites/work/external.svg'
import { Sprite } from '@/components/Sprite'
import { Theme } from '@/constants'
import { useTheme } from '@/hooks'

interface MenuRowProps {
  href: string
  /** A `.svg` imported from `@/assets/sprites`. */
  sprite: string
  label: string
  /** A Silkscreen line under the label — the repo's name on the GitHub rows. */
  sublabel?: string
  /** For a row that leaves the app and shouldn't take the session with it. */
  opensInNewTab?: boolean
  onClick: () => void
}

// One 60px row of the phone's menu (§7): a sprite, the label, and an arrow,
// over a 2px dashed ink rule.
//
// Work (NL-Welcome-Menu-Mobile) drops the sprite and draws the arrow as a line
// icon: a chevron for a row that stays on the page, an out-arrow for one that
// opens a new tab.
export function MenuRow({ href, sprite, label, sublabel, opensInNewTab, onClick }: MenuRowProps) {
  const { theme } = useTheme()
  const workArrow = opensInNewTab ? external : chevronRight

  return (
    <li>
      <a
        href={href}
        target={opensInNewTab ? '_blank' : undefined}
        className="flex min-h-[60px] items-center justify-between gap-3 border-b-2 border-dashed border-border-subtle work:border-b work:border-solid px-1 py-2 text-foreground outline-none focus-visible:outline-[3px] focus-visible:outline-ring"
        onClick={onClick}
      >
        <span className="flex items-center gap-3.5">
          <Sprite source={sprite} className="h-auto w-[30px] shrink-0 work:hidden" />

          <span className="flex flex-col gap-0.5">
            <span className="text-[19px] leading-tight font-extrabold work:text-[17px] work:font-medium">{label}</span>
            {sublabel && <span className="font-label text-[10px] text-subtle-foreground">{sublabel}</span>}
          </span>
        </span>

        {theme === Theme.WORK ? (
          <Sprite source={workArrow} className="size-4 shrink-0" />
        ) : (
          <span aria-hidden="true" className="font-label text-[14px]">
            →
          </span>
        )}
      </a>
    </li>
  )
}
