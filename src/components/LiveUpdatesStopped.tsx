import { TryAgainButton } from '@/components/TryAgainButton'
import { useContent } from '@/hooks'

// The Reveal's socket dropped: a lost connection, a server restart, or the
// Session expiring. The last Reveal stays on screen, so this is a note rather
// than ConnectionLost's full screen. Try again re-runs endedLoader, which opens
// a fresh connection, or lands on /not-found if the Session is gone.
//
// Pinned bottom right, so it shows wherever the page is scrolled. Full width
// along the bottom on mobile.
export function LiveUpdatesStopped() {
  const content = useContent()

  return (
    <div
      role="status"
      className="fixed inset-x-3 bottom-3 z-10 flex flex-col items-start gap-3 border-[3px] border-ink bg-white px-4 py-3 font-body text-[15px] text-ink shadow-px tablet:inset-x-auto tablet:right-6 tablet:bottom-6 tablet:max-w-sm"
    >
      <p>{content.reveal.liveUpdatesStopped}</p>

      <TryAgainButton />
    </div>
  )
}
