import person from '@/assets/sprites/work/person.svg'
import shield from '@/assets/sprites/work/shield.svg'
import { SessionConnectionStatus } from '@/constants'
import type { EndedView, RevealViewer, RoleContent, SessionConnectionState } from '@/types'

// The role chip on the Reveal's window, in the current theme's words. A visitor
// who never joined gets none.
export function revealChip(viewer: RevealViewer, content: RoleContent): string | undefined {
  if (viewer.isAdmin) {
    return content.admin
  }

  if (viewer.hasJoined) {
    return content.participant
  }

  return undefined
}

// The icon Work puts before that chip: a shield for the Admin, a person for a
// Participant. Nothing for a visitor, who has no chip.
export function revealChipIcon(viewer: RevealViewer): string | undefined {
  if (viewer.isAdmin) {
    return shield
  }

  if (viewer.hasJoined) {
    return person
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
      name: state.name,
      canVote: state.isLive && state.name !== null,
      error: state.error,
      isLive: state.isLive,
    }
  }

  const isOpening =
    state.status === SessionConnectionStatus.CONNECTING ||
    state.status === SessionConnectionStatus.ACTIVE

  return {
    reveal: null,
    selection: null,
    name: null,
    canVote: false,
    error: null,
    isLive: isOpening,
  }
}
