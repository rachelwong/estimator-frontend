// The live connection state machine. Pure: no React, no router, no socket.
//
//   CONNECTING ──identity ack──► ACTIVE ──session-ended──► ENDED
//       │  └─session-info (ended)──────────────────────────► ENDED
//       ├──error──► REJECTED
//       └──disconnect──► DISCONNECTED ◄──disconnect── ACTIVE
//
// REJECTED, DISCONNECTED and ENDED are terminal. Only a fresh connection
// leaves them.
import { SessionAction, SessionConnectionStatus } from '@/constants'
import type {
  ActiveConnectionState,
  ConnectingConnectionState,
  SessionConnectionAction,
  SessionConnectionState,
} from '@/types'

export const initialConnectionState: SessionConnectionState = {
  status: SessionConnectionStatus.CONNECTING,
  pointSystem: null,
}

export function sessionConnectionReducer(
  state: SessionConnectionState,
  action: SessionConnectionAction,
): SessionConnectionState {
  if (state.status === SessionConnectionStatus.CONNECTING) {
    return nextStateWhileConnecting(state, action)
  }

  if (state.status === SessionConnectionStatus.ACTIVE) {
    return nextStateWhileActive(state, action)
  }

  // Terminal. Ignoring DISCONNECTED here keeps REJECTED's message after
  // UNKNOWN_SESSION closes the socket, and keeps ENDED after the store closes
  // its own socket.
  return state
}

function nextStateWhileConnecting(
  state: ConnectingConnectionState,
  action: SessionConnectionAction,
): SessionConnectionState {
  switch (action.type) {
    // A socket connecting as the Session ends is admitted and told so
    // (decision #22b).
    case SessionAction.SESSION_INFO_RECEIVED: {
      if (action.ended) {
        return { status: SessionConnectionStatus.ENDED, selection: null }
      }

      return { ...state, pointSystem: action.pointSystem }
    }

    // session-info always precedes the ack, so a null here is a protocol
    // violation rather than a case to handle.
    case SessionAction.IDENTITY_ACKED: {
      if (state.pointSystem === null) {
        throw new Error('Identity acknowledged before session-info')
      }

      return {
        status: SessionConnectionStatus.ACTIVE,
        pointSystem: state.pointSystem,
        selection: action.selection,
        error: null,
        isAdmin: action.isAdmin,
      }
    }

    case SessionAction.ERROR_RECEIVED: {
      return { status: SessionConnectionStatus.REJECTED, error: action.error }
    }

    case SessionAction.DISCONNECTED: {
      return { status: SessionConnectionStatus.DISCONNECTED }
    }

    default: {
      return state
    }
  }
}

// Once someone has joined: record their Selection as the server confirms it,
// show or clear an error, and stop when the Session ends or the connection drops.
function nextStateWhileActive(
  state: ActiveConnectionState,
  action: SessionConnectionAction,
): SessionConnectionState {
  switch (action.type) {
    // The server sends the outcome, so it is stored as-is.
    case SessionAction.SELECTION_ACKED: {
      return { ...state, selection: action.selection, error: null }
    }

    case SessionAction.ERROR_RECEIVED: {
      return { ...state, error: action.error }
    }

    case SessionAction.ERROR_DISMISSED: {
      return { ...state, error: null }
    }

    // The Selection rides along so the Reveal can mark it.
    case SessionAction.SESSION_ENDED: {
      return { status: SessionConnectionStatus.ENDED, selection: state.selection }
    }

    case SessionAction.DISCONNECTED: {
      return { status: SessionConnectionStatus.DISCONNECTED }
    }

    default: {
      return state
    }
  }
}
