// State and actions for lib/sessionConnectionReducer.ts. See the connection
// state diagram in PLAN.md.
// SessionConnectionStatus and SessionAction are value imports: `typeof X.Y`
// needs the value binding.
import { SessionAction, SessionConnectionStatus } from '../constants'
import type { ErrorCode } from './constants'
import type { PointSystem, Selection } from './protocol'

// `code` is optional: the server's "not identified yet" error carries none.
export interface SessionError {
  code?: ErrorCode
  message: string
}

// CONNECTING holds pointSystem because session-info arrives before the
// identity ack, and is the only message carrying it.
export type SessionConnectionState =
  | { status: typeof SessionConnectionStatus.CONNECTING; pointSystem: PointSystem | null }
  | {
      status: typeof SessionConnectionStatus.ACTIVE
      pointSystem: PointSystem
      selection: Selection | null
      error: SessionError | null
      isAdmin: boolean
    }
  | { status: typeof SessionConnectionStatus.REJECTED; error: SessionError }
  | { status: typeof SessionConnectionStatus.DISCONNECTED }
  | { status: typeof SessionConnectionStatus.ENDED }

export type ConnectingConnectionState = Extract<
  SessionConnectionState,
  { status: typeof SessionConnectionStatus.CONNECTING }
>

export type ActiveConnectionState = Extract<
  SessionConnectionState,
  { status: typeof SessionConnectionStatus.ACTIVE }
>

// One action per socket event, plus ERROR_DISMISSED from the UI.
// IDENTITY_ACKED covers both `joined` (selection null) and
// `admin-acknowledged` (the Admin's current Selection).
export type SessionConnectionAction =
  | {
      type: typeof SessionAction.SESSION_INFO_RECEIVED
      pointSystem: PointSystem
      ended: boolean
    }
  | { type: typeof SessionAction.IDENTITY_ACKED; isAdmin: boolean; selection: Selection | null }
  | { type: typeof SessionAction.SELECTION_ACKED; square: Selection }
  | { type: typeof SessionAction.ERROR_RECEIVED; error: SessionError }
  | { type: typeof SessionAction.ERROR_DISMISSED }
  | { type: typeof SessionAction.DISCONNECTED }
  | { type: typeof SessionAction.SESSION_ENDED }

// Who the socket identifies as once session-info arrives: a Participant by
// name (`join`), or the Admin by stored token (`admin-auth`).
export type SessionIdentity = { name: string } | { adminToken: string }

// What joinAction hands back to JoinSessionPage when the join did not land.
export interface JoinSessionActionData {
  error: string
}

// One live connection to one Session, kept in lib/sessionConnectionRegistry.ts
// so it survives the /join → /start navigation.
export interface SessionConnectionStore {
  getSnapshot: () => SessionConnectionState
  subscribe: (listener: () => void) => () => void
  // Resolves once the state leaves CONNECTING.
  whenSettled: () => Promise<SessionConnectionState>
  select: (time: number, resource: number) => void
  dismissError: () => void
  // No-op for a Participant — only an Admin identity carries a token.
  endSession: () => void
  close: () => void
}
