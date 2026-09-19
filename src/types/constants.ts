// The type derived from each const object in src/constants.ts. Kept separate
// because a const's runtime value and its compile-time type are two different
// things — they don't share a file just because one is computed from the other.
//
// The import below is a value import on purpose: `typeof X` needs the value
// binding to derive from. TypeScript keeps the imported value and the exported
// type of the same name apart, since values and types are separate namespaces.
import {
  AreaPreview,
  CellState,
  ErrorCode,
  GridMode,
  PointSystemType,
  SessionAction,
  SessionConnectionStatus,
  SocketLifecycleEvent,
  WebSocketEvent,
} from '../constants'

export type PointSystemType = (typeof PointSystemType)[keyof typeof PointSystemType]

export type GridMode = (typeof GridMode)[keyof typeof GridMode]

export type CellState = (typeof CellState)[keyof typeof CellState]

export type AreaPreview = (typeof AreaPreview)[keyof typeof AreaPreview]

export type SessionConnectionStatus =
  (typeof SessionConnectionStatus)[keyof typeof SessionConnectionStatus]

export type SessionAction = (typeof SessionAction)[keyof typeof SessionAction]

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode]

export type WebSocketEvent = (typeof WebSocketEvent)[keyof typeof WebSocketEvent]

export type SocketLifecycleEvent =
  (typeof SocketLifecycleEvent)[keyof typeof SocketLifecycleEvent]
