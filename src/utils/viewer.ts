import type { RevealViewer } from '@/types'

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
