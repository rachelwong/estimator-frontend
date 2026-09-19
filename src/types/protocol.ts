// Hand-mirrored from estimator-backend/src/types.ts and src/schemas.ts.
// Keep the two in step by hand — about six shapes, so a shared package or a
// submodule would cost more than it saves.
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
