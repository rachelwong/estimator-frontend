// The type derived from each const object in src/constants.ts. Kept separate
// because a const's runtime value and its compile-time type are two different
// things — they don't share a file just because one is computed from the other.
//
// The import below is a value import on purpose: `typeof X` needs the value
// binding to derive from. TypeScript keeps the imported value and the exported
// type of the same name apart, since values and types are separate namespaces.
import {
  AxisValueEmphasis,
  Breakpoint,
  ChipSize,
  ChipVariant,
  ErrorCode,
  GridMode,
  HoverSource,
  PixelBarSize,
  PointSystemType,
  SessionAction,
  SessionConnectionStatus,
  SocketLifecycleEvent,
  SquareHighlight,
  SquareLabelSize,
  WebSocketEvent,
} from '../constants'

export type PointSystemType = (typeof PointSystemType)[keyof typeof PointSystemType]

export type GridMode = (typeof GridMode)[keyof typeof GridMode]

export type Breakpoint = (typeof Breakpoint)[keyof typeof Breakpoint]

export type SquareLabelSize = (typeof SquareLabelSize)[keyof typeof SquareLabelSize]

export type SquareHighlight = (typeof SquareHighlight)[keyof typeof SquareHighlight]

export type HoverSource = (typeof HoverSource)[keyof typeof HoverSource]

export type AxisValueEmphasis = (typeof AxisValueEmphasis)[keyof typeof AxisValueEmphasis]

export type SessionConnectionStatus =
  (typeof SessionConnectionStatus)[keyof typeof SessionConnectionStatus]

export type SessionAction = (typeof SessionAction)[keyof typeof SessionAction]

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode]

export type WebSocketEvent = (typeof WebSocketEvent)[keyof typeof WebSocketEvent]

export type SocketLifecycleEvent =
  (typeof SocketLifecycleEvent)[keyof typeof SocketLifecycleEvent]

export type ChipVariant = (typeof ChipVariant)[keyof typeof ChipVariant]

export type ChipSize = (typeof ChipSize)[keyof typeof ChipSize]

export type PixelBarSize = (typeof PixelBarSize)[keyof typeof PixelBarSize]
