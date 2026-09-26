// Keeps one live connection per Session, so the socket opened by /join's
// action is still there when /start renders. Re-joining there would create a
// second Participant.
//
// A store wires lib/socket.ts events to reducer actions one to one, holds the
// resulting state, and notifies subscribers. Nothing is merged or interpreted
// on the way in.
import {
  SessionAction,
  SessionConnectionStatus,
  SocketLifecycleEvent,
  WebSocketEvent,
} from '@/constants'
import type {
  SessionConnectionAction,
  SessionConnectionState,
  SessionConnectionStore,
  SessionIdentity,
} from '@/types'
import { initialConnectionState, sessionConnectionReducer } from './sessionConnectionReducer'
import { createSocket } from './socket'

const registry = new Map<string, SessionConnectionStore>()

// Called once per entry — startLoader for an Admin, joinAction for a
// Participant — never on render.
export function getOrCreateSessionConnection(
  sessionId: string,
  identity: SessionIdentity,
): SessionConnectionStore {
  // Look for a connection we've already opened for this Session.
  const existing = registry.get(sessionId)

  // If there is one, hand it back as-is so the same socket is reused. The
  // identity passed in this time is ignored — the existing connection has
  // already identified itself.
  if (existing) {
    return existing
  }

  // Otherwise open a new socket for this Session and build a store around it.
  const store = createSessionConnectionStore(sessionId, identity)

  // Remember it, so the next call for this Session gets this same store back.
  registry.set(sessionId, store)

  return store
}

export function peekSessionConnection(sessionId: string): SessionConnectionStore | undefined {
  return registry.get(sessionId)
}

// A store still connecting or active. What makes Back from /start safe: /join
// sees it and returns to /start instead of joining a second time.
export function hasLiveSessionConnection(sessionId: string): boolean {
  const store = registry.get(sessionId)
  if (!store) {
    return false
  }

  return !isTerminal(store.getSnapshot())
}

// Closes the socket, then drops the entry. Closing matters — dropping the
// entry alone leaks a live socket.
//
// Eviction is never automatic on a terminal state: a store that evicted
// itself would be rebuilt by the next getOrCreate, and a failing connection
// would spin. The leak is bounded by the tab's lifetime.
export function removeSessionConnection(sessionId: string): void {
  registry.get(sessionId)?.close()
  registry.delete(sessionId)
}

function createSessionConnectionStore(
  sessionId: string,
  identity: SessionIdentity,
): SessionConnectionStore {
  const socket = createSocket(sessionId)
  const listeners = new Set<() => void>()
  let state = initialConnectionState

  function dispatch(action: SessionConnectionAction): void {
    const next = sessionConnectionReducer(state, action)
    if (next === state) {
      return
    }

    state = next
    listeners.forEach((listener) => listener())

    // The server does not close the socket after session-ended, and a later
    // server restart would otherwise drag a tab on ENDED back to /join. The
    // local disconnect this fires is absorbed by the reducer's terminal guard.
    if (isTerminal(state)) {
      socket.disconnect()
    }
  }

  function subscribe(listener: () => void): () => void {
    listeners.add(listener)

    return () => {
      listeners.delete(listener)
    }
  }

  socket.on(WebSocketEvent.SESSION_INFO, ({ pointSystem, ended }) => {
    dispatch({ type: SessionAction.SESSION_INFO_RECEIVED, pointSystem, ended })

    // Identify only once the Session is known to be open. An ended Session
    // has already moved to ENDED, and joining it would only earn an error.
    if (state.status === SessionConnectionStatus.CONNECTING) {
      if ('adminToken' in identity) {
        socket.emit(WebSocketEvent.ADMIN_AUTHENTICATE, identity.adminToken)
      } else {
        socket.emit(WebSocketEvent.JOIN, identity.name)
      }
    }
  })

  socket.on(WebSocketEvent.JOINED, () => {
    dispatch({ type: SessionAction.IDENTITY_ACKED, isAdmin: false, selection: null })
  })

  socket.on(WebSocketEvent.ADMIN_ACKNOWLEDGED, ({ selection }) => {
    dispatch({ type: SessionAction.IDENTITY_ACKED, isAdmin: true, selection })
  })

  socket.on(WebSocketEvent.SELECTION_CHANGED, (selection) => {
    dispatch({ type: SessionAction.SELECTION_ACKED, selection })
  })

  // The Reveal payload is dropped — /ended refetches it over REST.
  socket.on(WebSocketEvent.SESSION_ENDED, () => {
    dispatch({ type: SessionAction.SESSION_ENDED })
  })

  socket.on(WebSocketEvent.ERROR, ({ error, message }) => {
    dispatch({ type: SessionAction.ERROR_RECEIVED, error: { code: error, message } })
  })

  socket.on(SocketLifecycleEvent.DISCONNECT, () => {
    dispatch({ type: SessionAction.DISCONNECTED })
  })

  // With reconnection: false, an unreachable backend fails the handshake
  // without ever firing disconnect. Without this, whenSettled never resolves.
  socket.on(SocketLifecycleEvent.CONNECT_ERROR, () => {
    dispatch({ type: SessionAction.DISCONNECTED })
  })

  return {
    getSnapshot: () => state,
    subscribe,

    whenSettled: () =>
      new Promise((resolve) => {
        if (state.status !== SessionConnectionStatus.CONNECTING) {
          resolve(state)
          return
        }

        const unsubscribe = subscribe(() => {
          if (state.status !== SessionConnectionStatus.CONNECTING) {
            unsubscribe()
            resolve(state)
          }
        })
      }),

    // No optimistic update: selection moves only on the server's ack.
    select: (time, resource) => {
      socket.emit(WebSocketEvent.SELECT_SQUARE, { time, resource })
    },

    dismissError: () => {
      dispatch({ type: SessionAction.ERROR_DISMISSED })
    },

    endSession: () => {
      if ('adminToken' in identity) {
        socket.emit(WebSocketEvent.END_SESSION, identity.adminToken)
      }
    },

    close: () => {
      socket.disconnect()
    },
  }
}

// REJECTED, DISCONNECTED and ENDED. Only a fresh connection leaves them.
function isTerminal(state: SessionConnectionState): boolean {
  return (
    state.status !== SessionConnectionStatus.CONNECTING &&
    state.status !== SessionConnectionStatus.ACTIVE
  )
}
