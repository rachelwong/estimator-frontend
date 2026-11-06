import { XIcon } from 'lucide-react'
import { useContent } from '@/hooks'
import type { SessionError } from '@/types'

interface ErrorBannerProps {
  error: SessionError
  onDismiss: () => void
}

// Custom rather than a toast (decision #13): it stays until dismissed, so a
// rejected Selection can't slip past unseen.
//
// The design draws no error inside a live window, so in Play its `error-surface`
// matches the End button's coral, with the button's edge and shadow (§4) — ink
// on coral clears AA, and it reads as the same family as the one other alarming
// thing on the screen.
//
// The message is the server's own, shown as it arrives, in either theme.
export function ErrorBanner({ error, onDismiss }: ErrorBannerProps) {
  const content = useContent()

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-panel border-[3px] border-error-border bg-error-surface px-4 py-3 font-body text-[15px] font-bold text-foreground shadow-notice work:border work:py-3 work:pr-3 work:text-[14px] work:leading-[22px] work:font-normal"
    >
      <p className="flex-1">{error.message}</p>

      <button
        type="button"
        aria-label={content.action.dismiss}
        className="-m-1 cursor-pointer p-1 outline-none focus-visible:outline-[3px] focus-visible:outline-ring"
        onClick={onDismiss}
      >
        <XIcon className="size-5" />
      </button>
    </div>
  )
}
