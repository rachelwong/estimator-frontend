import { SessionConnectionStatus } from '@/constants'
import type { EndedView, RevealViewer, SessionConnectionState } from '@/types'

// The role chip on the Reveal's window. A visitor who never joined gets none.
export function revealChip(viewer: RevealViewer): string | undefined {
  if (viewer.isAdmin) {
    return 'Admin'
  }

  if (viewer.hasJoined) {
    return 'Participant'
  }

  return undefined
}

// The Reveal's live connection, read for EndedPage. Before ENDED, the
// connection is still opening (or a Participant's is a beat behind the end):
// nothing of its own to show yet, but not lost either.
export function endedView(state: SessionConnectionState): EndedView {
  if (state.status === SessionConnectionStatus.ENDED) {
    return {
      reveal: state.reveal,
      selection: state.selection,
      error: state.error,
      isLive: state.isLive,
    }
  }

  const isOpening =
    state.status === SessionConnectionStatus.CONNECTING ||
    state.status === SessionConnectionStatus.ACTIVE

  return { reveal: null, selection: null, error: null, isLive: isOpening }
}
