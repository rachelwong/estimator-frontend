// State and actions for lib/sessionConnectionReducer.ts. See the connection
// state diagram in PLAN.md.
// SessionConnectionStatus and SessionAction are value imports: `typeof X.Y`
// needs the value binding.
import { SessionAction, SessionConnectionStatus } from '../constants'
import type { ErrorCode } from './constants'
import type { PointSystem, RevealPayload, Selection } from './protocol'

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
      name: string
    }
  | { status: typeof SessionConnectionStatus.REJECTED; error: SessionError }
  | { status: typeof SessionConnectionStatus.DISCONNECTED }
  // The Reveal, still live: votes keep changing after the end.
  // - `selection`: "Your Square". Null for a watcher, or someone holding none.
  // - `reveal`: the latest from the socket. Null until one arrives; the page
  //   shows REST's until then.
  // - `name`: the viewer's own. Null for a watcher, who can't vote.
  // - `isLive`: false once the socket drops. The last Reveal stays on screen.
  | {
      status: typeof SessionConnectionStatus.ENDED
      selection: Selection | null
      reveal: RevealPayload | null
      name: string | null
      isLive: boolean
      error: SessionError | null
    }

export type ConnectingConnectionState = Extract<
  SessionConnectionState,
  { status: typeof SessionConnectionStatus.CONNECTING }
>

export type ActiveConnectionState = Extract<
  SessionConnectionState,
  { status: typeof SessionConnectionStatus.ACTIVE }
>

export type EndedConnectionState = Extract<
  SessionConnectionState,
  { status: typeof SessionConnectionStatus.ENDED }
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
  | {
      type: typeof SessionAction.IDENTITY_ACKED
      isAdmin: boolean
      selection: Selection | null
      name: string
    }
  | { type: typeof SessionAction.SELECTION_ACKED; selection: Selection | null }
  | { type: typeof SessionAction.ERROR_RECEIVED; error: SessionError }
  | { type: typeof SessionAction.ERROR_DISMISSED }
  | { type: typeof SessionAction.DISCONNECTED }
  | { type: typeof SessionAction.SESSION_ENDED; reveal: RevealPayload }
  | { type: typeof SessionAction.REVEAL_UPDATED; reveal: RevealPayload }

// Who the socket identifies as once session-info arrives: a Participant by
// name (`join`), the Admin by stored token (`admin-auth`), or nobody — a
// watcher on the Reveal, who only receives.
export type SessionIdentity = { name: string } | { adminToken: string } | { watchOnly: true }

// One live connection to one Session, kept in lib/sessionConnectionRegistry.ts
// so it survives the /join → /start navigation.
export interface SessionConnectionStore {
  getSnapshot: () => SessionConnectionState
  subscribe: (listener: () => void) => () => void
  // Resolves once the state leaves CONNECTING.
  whenSettled: () => Promise<SessionConnectionState>
  select: (time: number, resource: number) => void
  dismissError: () => void
  // No-op for a Participant or watcher — only an Admin identity carries a token.
  endSession: () => void
  close: () => void
}

// What useSessionConnection hands a page: the live state, whether this browser
// is the Admin, and the store's commands.
export interface SessionConnection {
  state: SessionConnectionState
  isAdmin: boolean
  select: SessionConnectionStore['select']
  dismissError: SessionConnectionStore['dismissError']
  endSession: SessionConnectionStore['endSession']
}
