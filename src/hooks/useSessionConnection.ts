import { useSyncExternalStore } from 'react'
import { getAdminToken } from '@/lib/adminToken'
import { peekSessionConnection } from '@/lib/sessionConnectionRegistry'
import type { SessionConnection } from '@/types'

// Reads the store a loader or action already created. No fork here — this
// only subscribes. getSnapshot returns the reducer's state, which only
// changes reference on a real transition, so it is safe as a snapshot.
export function useSessionConnection(sessionId: string): SessionConnection {
  const store = peekSessionConnection(sessionId)!
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot)

  return {
    state,
    // Read from the token, not the state: DISCONNECTED no longer carries isAdmin.
    isAdmin: getAdminToken(sessionId) !== null,
    select: store.select,
    dismissError: store.dismissError,
    endSession: store.endSession,
  }
}
