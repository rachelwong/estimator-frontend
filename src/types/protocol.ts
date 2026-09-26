// Hand-mirrored from estimator-backend/src/types.ts and src/schemas.ts.
// Keep the two in step by hand — about six shapes, so a shared package or a
// submodule would cost more than it saves.
// WebSocketEvent is a value import: computed keys below need the value binding.
import { WebSocketEvent } from '../constants'
import type { ErrorCode, PointSystemType } from './constants'

export interface PointSystem {
  type: PointSystemType
  sliderMax: number
  axisValues: number[]
}

export interface Selection {
  time: number
  resource: number
}

export interface RevealSquare {
  time: number
  resource: number
  names: string[]
}

export interface RevealPayload {
  squares: RevealSquare[]
  abstained: string[]
}

// The request sends a bare type string, the response sends the whole computed
// point system back. Distinct on purpose — the server works out axisValues.
export interface CreateSessionRequest {
  adminName: string
  pointSystemType: PointSystemType
  sliderMax: number
}

export interface CreateSessionResponse {
  sessionId: string
  adminToken: string
  adminParticipantId: string
  adminName: string
  pointSystem: PointSystem
}

// `reveal` is present only once the session has ended.
export interface GetSessionResponse {
  sessionId: string
  pointSystem: PointSystem
  ended: boolean
  reveal?: RevealPayload
}

// One failure shape for both transports — middleware/errorHandler.ts on REST,
// ws/handlers.ts on the socket.
export interface ErrorResponse {
  error: ErrorCode
  message: string
}

// Socket event maps, hand-mirrored from estimator-backend/src/ws/events.ts.
// Keyed off WebSocketEvent so a typo'd event name fails to compile.
export interface ClientToServerEvents {
  [WebSocketEvent.JOIN]: (name: string) => void
  [WebSocketEvent.ADMIN_AUTHENTICATE]: (adminToken: string) => void
  [WebSocketEvent.SELECT_SQUARE]: (payload: Selection) => void
  [WebSocketEvent.END_SESSION]: (adminToken: string) => void
}

// `error` is optional: the "not identified yet" case sends a message only.
export interface ServerToClientEvents {
  [WebSocketEvent.SESSION_INFO]: (payload: {
    sessionId: string
    pointSystem: PointSystem
    ended: boolean
  }) => void
  [WebSocketEvent.JOINED]: (payload: { participantId: string; name: string }) => void
  [WebSocketEvent.ADMIN_ACKNOWLEDGED]: (payload: {
    participantId: string
    name: string
    selection: Selection | null
  }) => void
  [WebSocketEvent.SELECTION_ACKNOWLEDGED]: (payload: Selection) => void
  // Sent to every tab of the one participant. null means cleared.
  [WebSocketEvent.SELECTION_CHANGED]: (payload: Selection | null) => void
  [WebSocketEvent.SESSION_ENDED]: (payload: RevealPayload) => void
  [WebSocketEvent.ERROR]: (payload: { error?: ErrorCode; message: string }) => void
}
