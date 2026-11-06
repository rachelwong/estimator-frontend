import { CopyIcon, LinkIcon, ShieldIcon } from 'lucide-react'
import { useState } from 'react'
import { AdminControls } from '@/components/AdminControls'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { COPIED_FEEDBACK_MS } from '@/constants'
import { useContent } from '@/hooks'
import { cn } from '@/lib/utils'

interface ShareLinkProps {
  sessionId: string
  /** Work's desktop admin bar carries End too (NL-Active-Desktop); hidden everywhere else. */
  onEndSession: () => void
}

// The share bar (DESIGN.md §7, the default of the three designed options): a
// full-width `page-top` strip under the header, holding the link and a Copy
// button. Its content lines up with the window below it, so the inner row takes
// the window's widths (§5). On mobile the row stacks.
//
// Work keeps the strip on a phone and a tablet. On a desktop it lifts off the
// page into the admin bar: a 980px raised panel floating 28px above the bottom
// edge, led by the Admin's role and closing on End session & reveal, which
// leaves the header there (NL-Active-Desktop). On a phone Copy is an icon.
//
// Points at /join, the entry for anyone without an identity. The Admin's own
// /start would bounce them there anyway. "Copy link" fills `copied` and reads
// "Copied!" for 1.6s once the link is on the clipboard.
export function ShareLink({ sessionId, onEndSession }: ShareLinkProps) {
  const [isCopied, setIsCopied] = useState(false)
  const content = useContent()
  const url = `${window.location.origin}/${sessionId}/join`

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS)
  }

  return (
    <div className="relative z-10 border-b-[3px] border-border-subtle bg-share-bar px-3 py-3 tablet:px-10 tablet:py-3.5 work:border-b work:pb-3.5 work:tablet:py-3 work:desktop:fixed work:desktop:bottom-7 work:desktop:left-1/2 work:desktop:w-[980px] work:desktop:max-w-[calc(100%-64px)] work:desktop:-translate-x-1/2 work:desktop:rounded-bar work:desktop:border work:desktop:border-border work:desktop:bg-raised work:desktop:py-2.5 work:desktop:pr-2.5 work:desktop:pl-[18px] work:desktop:shadow-bar">
      <div className="mx-auto flex max-w-[366px] flex-col gap-2 tablet:max-w-[740px] tablet:flex-row tablet:items-center tablet:gap-3.5 desktop:max-w-[780px] work:tablet:max-w-[754px] work:tablet:gap-4 work:desktop:max-w-none work:desktop:gap-3">
        <span className="hidden items-center gap-2 text-[14px] leading-none font-semibold whitespace-nowrap work:desktop:flex">
          <ShieldIcon aria-hidden="true" className="size-4 text-ring" />
          {content.role.admin}
        </span>
        <span aria-hidden="true" className="hidden h-6 w-px bg-border work:desktop:block" />

        <span className="flex items-center gap-2 font-label text-[12px] whitespace-nowrap text-foreground work:text-[14px] work:leading-none work:font-medium work:desktop:text-muted-foreground">
          <LinkIcon aria-hidden="true" className="size-[18px] work:size-4 work:text-subtle-foreground work:desktop:hidden" />
          {content.shareLink.label}
        </span>

        <div className="flex min-w-0 grow gap-2.5 work:gap-2 work:tablet:gap-4 work:desktop:gap-3">
          {/* A readonly field rather than plain text, so the link can still be
              selected by hand where the clipboard is blocked. */}
          <Input
            readOnly
            value={url}
            aria-label={content.shareLink.fieldLabel}
            className="truncate font-label text-[11px] tablet:h-11 tablet:text-[13px] work:font-body work:text-[14px] work:font-medium work:tablet:h-10 work:tablet:text-[14px]"
            onFocus={(event) => event.target.select()}
          />

          <Button
            type="button"
            variant="copy"
            className={cn(
              'min-w-[112px] work:w-11 work:min-w-0 work:px-0 work:text-[14px] work:tablet:h-10 work:tablet:w-auto work:tablet:px-4',
              isCopied && 'border-copied-border bg-copied',
            )}
            onClick={handleCopy}
          >
            <CopyIcon aria-hidden="true" className="hidden text-subtle-foreground work:block" />
            <span className="work:sr-only work:tablet:not-sr-only">
              {isCopied ? content.shareLink.copied : content.shareLink.copy}
            </span>
          </Button>

          <AdminControls
            onEndSession={onEndSession}
            className="hidden work:desktop:inline-flex work:desktop:h-10 work:desktop:px-4 work:desktop:text-[14px] work:desktop:font-semibold"
          />
        </div>
      </div>
    </div>
  )
}
