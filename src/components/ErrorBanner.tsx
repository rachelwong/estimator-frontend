import { XIcon } from 'lucide-react'
import type { SessionError } from '@/types'

interface ErrorBannerProps {
  error: SessionError
  onDismiss: () => void
}

// Custom rather than a toast (decision #13): it stays until dismissed, so a
// rejected Selection can't slip past unseen.
//
// The design draws no error inside a live window, so this borrows the End
// button's `danger` fill and the button edge and shadow (§4) — ink on danger
// clears AA, and it reads as the same family as the one other alarming thing on
// the screen.
export function ErrorBanner({ error, onDismiss }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 border-[3px] border-ink bg-danger px-4 py-3 font-body text-[15px] font-bold text-ink shadow-px"
    >
      <p className="flex-1">{error.message}</p>

      <button
        type="button"
        aria-label="Dismiss"
        className="-m-1 cursor-pointer p-1 outline-none focus-visible:outline-[3px] focus-visible:outline-ink"
        onClick={onDismiss}
      >
        <XIcon className="size-5" />
      </button>
    </div>
  )
}
