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
