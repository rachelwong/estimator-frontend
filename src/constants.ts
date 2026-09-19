// The one home for every const object that replaces a magic string, plus the
// handful of values that come from the spec. Values only — the type derived
// from each lives in src/types/constants.ts.

export const PointSystemType = {
  NUMERICAL: 'numerical',
  FIBONACCI: 'fibonacci',
} as const

export const GridMode = {
  INTERACTIVE: 'interactive',
  READONLY: 'readonly',
} as const

export const CellState = {
  EMPTY: 'empty',
  CHOSEN: 'chosen',
} as const

export const SessionConnectionStatus = {
  CONNECTING: 'connecting',
  ACTIVE: 'active',
  REJECTED: 'rejected',
  DISCONNECTED: 'disconnected',
  ENDED: 'ended',
} as const

export const SessionAction = {
  SESSION_INFO_RECEIVED: 'sessionInfoReceived',
  IDENTITY_ACKED: 'identityAcked',
  SELECTION_ACKED: 'selectionAcked',
  ERROR_RECEIVED: 'errorReceived',
  ERROR_DISMISSED: 'errorDismissed',
  DISCONNECTED: 'disconnected',
  SESSION_ENDED: 'sessionEnded',
} as const

// Mirrors estimator-backend/src/errors.ts. Keys are ALL_CAPS here, which is a
// frontend convention — the values are what actually cross the wire.
export const ErrorCode = {
  INVALID_NAME: 'INVALID_NAME',
  INVALID_SLIDER_MAX: 'INVALID_SLIDER_MAX',
  UNKNOWN_SESSION: 'UNKNOWN_SESSION',
  INVALID_ADMIN_TOKEN: 'INVALID_ADMIN_TOKEN',
  INVALID_SELECTION: 'INVALID_SELECTION',
  SESSION_ENDED: 'SESSION_ENDED',
  INVALID_REQUEST: 'INVALID_REQUEST',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

// How far the admin's slider goes for each point system. Mirrors
// estimator-backend/src/pointSystems.ts — the server re-validates anyway, so
// this only keeps the UI from offering a value that would be rejected.
export const SLIDER_MAX_CEILING = {
  [PointSystemType.NUMERICAL]: 20,
  [PointSystemType.FIBONACCI]: 64,
} as const

// A missing session is an expected answer from GET /sessions/:id, not a
// failure, so lib/api.ts checks for this status by name.
export const HTTP_NOT_FOUND = 404
