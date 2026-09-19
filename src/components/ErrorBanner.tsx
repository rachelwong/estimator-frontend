import { XIcon } from 'lucide-react'
import type { SessionError } from '@/types'

interface ErrorBannerProps {
  error: SessionError
  onDismiss: () => void
}

// Custom rather than a toast (decision #13): it stays until dismissed, so a
// rejected Selection can't slip past unseen.
export function ErrorBanner({ error, onDismiss }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      <p className="flex-1">{error.message}</p>

      <button
        type="button"
        aria-label="Dismiss"
        className="cursor-pointer opacity-70 hover:opacity-100"
        onClick={onDismiss}
      >
        <XIcon className="size-4" />
      </button>
    </div>
  )
}
