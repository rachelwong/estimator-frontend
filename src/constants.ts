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

// Mirrors estimator-backend/src/ws/events.ts. Keys ALL_CAPS here; values are
// what cross the wire.
export const WebSocketEvent = {
  JOIN: 'join',
  ADMIN_AUTHENTICATE: 'admin-auth',
  SELECT_SQUARE: 'select-square',
  END_SESSION: 'end-session',
  SESSION_INFO: 'session-info',
  JOINED: 'joined',
  ADMIN_ACKNOWLEDGED: 'admin-acknowledged',
  SELECTION_ACKNOWLEDGED: 'selection-acknowledged',
  SESSION_ENDED: 'session-ended',
  ERROR: 'error',
} as const

// Socket.IO's own reserved client events, not part of the backend's protocol.
// With reconnection: false, a failed handshake fires CONNECT_ERROR and never
// DISCONNECT, so both have to be heard.
export const SocketLifecycleEvent = {
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
} as const

// How far the admin's slider goes for each point system. Mirrors
// estimator-backend/src/pointSystems.ts — the server re-validates anyway, so
// this only keeps the UI from offering a value that would be rejected.
export const SLIDER_MAX_CEILING = {
  [PointSystemType.NUMERICAL]: 20,
  [PointSystemType.FIBONACCI]: 64,
} as const

// Two mutually exclusive options, so radios rather than the wireframe's
// "dropdown list" — both are worth seeing at once.
export const POINT_SYSTEM_OPTIONS = [
  { value: PointSystemType.NUMERICAL, label: 'Numerical integers' },
  { value: PointSystemType.FIBONACCI, label: 'Fibonacci sequence' },
] as const

// Below this, the wait is a warm server and needs no explanation. Showing
// the notice anyway flashes it for a frame on every navigation.
export const LOADING_NOTICE_DELAY_MS = 400

// How long ShareLink's copy button shows its confirmation tick.
export const COPIED_FEEDBACK_MS = 2000

// The wireframe's Square fits about three names.
export const MAX_VISIBLE_NAMES = 3

export const CELL_CLASS = {
  [CellState.EMPTY]: 'bg-neutral-200',
  [CellState.CHOSEN]: 'bg-green-500 text-white',
} as const

// A missing session is an expected answer from GET /sessions/:id, not a
// failure, so lib/api.ts checks for this status by name.
export const HTTP_NOT_FOUND = 404
