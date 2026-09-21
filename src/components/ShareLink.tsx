import { LinkIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { COPIED_FEEDBACK_MS } from '@/constants'
import { cn } from '@/lib/utils'

interface ShareLinkProps {
  sessionId: string
}

// The share bar (DESIGN.md §7, the default of the three designed options): a
// full-width `page-top` strip under the header, holding the link and a Copy
// button. Its content lines up with the window below it, so the inner row takes
// the window's widths (§5). On mobile the row stacks.
//
// Points at /join, the entry for anyone without an identity. The Admin's own
// /start would bounce them there anyway. "Copy link" fills `copied` and reads
// "Copied!" for 1.6s once the link is on the clipboard.
export function ShareLink({ sessionId }: ShareLinkProps) {
  const [isCopied, setIsCopied] = useState(false)
  const url = `${window.location.origin}/${sessionId}/join`

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS)
  }

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

          <Button
            type="button"
            className={cn('min-w-[112px]', isCopied && 'bg-copied')}
            onClick={handleCopy}
          >
            {isCopied ? 'Copied!' : 'Copy link'}
          </Button>
        </div>
      </div>
    </div>
  )
}
