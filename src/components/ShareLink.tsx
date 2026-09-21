import { LinkIcon } from 'lucide-react'
import { CopyLinkButton } from '@/components/CopyLinkButton'
import { Input } from '@/components/ui/input'
import { sessionJoinUrl } from '@/lib/sessionLink'

interface ShareLinkProps {
  sessionId: string
}

// The share bar (DESIGN.md §7, the default of the three designed options): a
// full-width `page-top` strip under the header, holding the link and a Copy
// button. Its content lines up with the window below it, so the inner row takes
// the window's widths (§5). On mobile the row stacks.
export function ShareLink({ sessionId }: ShareLinkProps) {
  const url = sessionJoinUrl(sessionId)

  return (
    <div className="relative z-10 border-b-[3px] border-ink bg-page-top px-3 py-3 tablet:px-10 tablet:py-3.5">
      <div className="mx-auto flex max-w-[366px] flex-col gap-2 tablet:max-w-[740px] tablet:flex-row tablet:items-center tablet:gap-3.5 desktop:max-w-[780px]">
        <span className="flex items-center gap-2 font-label text-[12px] whitespace-nowrap text-ink">
          <LinkIcon aria-hidden="true" className="size-[18px]" />
          Share session link
        </span>

        <div className="flex min-w-0 grow gap-2.5">
          {/* A readonly field rather than plain text, so the link can still be
              selected by hand where the clipboard is blocked. */}
          <Input
            readOnly
            value={url}
            aria-label="Session link"
            className="truncate font-label text-[11px] tablet:h-11 tablet:text-[13px]"
            onFocus={(event) => event.target.select()}
          />

          <CopyLinkButton url={url} />
        </div>
      </div>
    </div>
  )
}
