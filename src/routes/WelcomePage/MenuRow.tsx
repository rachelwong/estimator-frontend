import { Sprite } from '@/components/Sprite'

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
export function MenuRow({ href, sprite, label, sublabel, opensInNewTab, onClick }: MenuRowProps) {
  return (
    <li>
      <a
        href={href}
        target={opensInNewTab ? '_blank' : undefined}
        className="flex min-h-[60px] items-center justify-between gap-3 border-b-2 border-dashed border-ink px-1 py-2 text-ink outline-none focus-visible:outline-[3px] focus-visible:outline-ink"
        onClick={onClick}
      >
        <span className="flex items-center gap-3.5">
          <Sprite source={sprite} className="h-auto w-[30px] shrink-0" />

          <span className="flex flex-col gap-0.5">
            <span className="text-[19px] leading-tight font-extrabold">{label}</span>
            {sublabel && <span className="font-label text-[10px] text-text-subtle">{sublabel}</span>}
          </span>
        </span>

        <span aria-hidden="true" className="font-label text-[14px]">
          →
        </span>
      </a>
    </li>
  )
}
