import { TryAgainButton } from '@/components/TryAgainButton'

// The Reveal's socket dropped: a lost connection, a server restart, or the
// Session expiring. The last Reveal stays on screen, so this is a note rather
// than ConnectionLost's full screen. Try again re-runs endedLoader, which opens
// a fresh connection, or lands on /not-found if the Session is gone.
export function LiveUpdatesStopped() {
  return (
    <div
      role="status"
      className="flex flex-col items-start gap-3 border-[3px] border-ink bg-white px-4 py-3 font-body text-[15px] text-ink shadow-px"
    >
      <p>Live updates have stopped. Reload to see the latest estimates.</p>

      <TryAgainButton />
    </div>
  )
}
