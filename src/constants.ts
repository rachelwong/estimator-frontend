// The one home for every const object that replaces a magic string, plus the
// handful of values that come from the spec. Values only — the type derived
// from each lives in src/types/constants.ts.

// Static paths. Session paths are built from the id where they're used.
export const RoutePath = {
  HOME: "/",
  WELCOME: "/welcome",
  NEW: "/new",
} as const;

export const PointSystemType = {
  NUMERICAL: "numerical",
  FIBONACCI: "fibonacci",
} as const;

export const GridMode = {
  INTERACTIVE: "interactive",
  READONLY: "readonly",
} as const;

// CHOSEN is your own Selection while the session runs; REVEALED is a Square
// somebody landed on, which only the ended screen ever shows.
export const CellState = {
  EMPTY: "empty",
  AREA: "area",
  CHOSEN: "chosen",
  REVEALED: "revealed",
} as const;

// Whether a Square sits inside the Area under the pointer.
export const AreaPreview = {
  OUTSIDE: "outside",
  INSIDE: "inside",
} as const;

// Which way an axis title reads. Resources runs bottom to top.
export const AxisOrientation = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
} as const;

export const SessionConnectionStatus = {
  CONNECTING: "connecting",
  ACTIVE: "active",
  REJECTED: "rejected",
  DISCONNECTED: "disconnected",
  ENDED: "ended",
} as const;

export const SessionAction = {
  SESSION_INFO_RECEIVED: "sessionInfoReceived",
  IDENTITY_ACKED: "identityAcked",
  SELECTION_ACKED: "selectionAcked",
  ERROR_RECEIVED: "errorReceived",
  ERROR_DISMISSED: "errorDismissed",
  DISCONNECTED: "disconnected",
  SESSION_ENDED: "sessionEnded",
} as const;

// Mirrors estimator-backend/src/errors.ts. Keys are ALL_CAPS here, which is a
// frontend convention — the values are what actually cross the wire.
export const ErrorCode = {
  INVALID_NAME: "INVALID_NAME",
  INVALID_SLIDER_MAX: "INVALID_SLIDER_MAX",
  UNKNOWN_SESSION: "UNKNOWN_SESSION",
  INVALID_ADMIN_TOKEN: "INVALID_ADMIN_TOKEN",
  INVALID_SELECTION: "INVALID_SELECTION",
  SESSION_ENDED: "SESSION_ENDED",
  INVALID_REQUEST: "INVALID_REQUEST",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

// Mirrors estimator-backend/src/ws/events.ts. Keys ALL_CAPS here; values are
// what cross the wire.
export const WebSocketEvent = {
  JOIN: "join",
  ADMIN_AUTHENTICATE: "admin-auth",
  SELECT_SQUARE: "select-square",
  END_SESSION: "end-session",
  SESSION_INFO: "session-info",
  JOINED: "joined",
  ADMIN_ACKNOWLEDGED: "admin-acknowledged",
  SELECTION_CHANGED: "selection-changed",
  SESSION_ENDED: "session-ended",
  ERROR: "error",
} as const;

// Socket.IO's own reserved client events, not part of the backend's protocol.
// With reconnection: false, a failed handshake fires CONNECT_ERROR and never
// DISCONNECT, so both have to be heard.
export const SocketLifecycleEvent = {
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",
} as const;

// The values the admin's slider can rest on, per point system. Mirrors
// estimator-backend/src/pointSystems.ts — the server re-validates anyway, so
// these only keep the UI from offering a value that would be rejected, or one
// that would build the same grid as its neighbour.
export const FIBONACCI_SEQUENCE = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55] as const;

export const NUMERICAL_MAX = 20;

// The Page keys ask for a bigger move than an arrow (WAI-ARIA slider pattern),
// and three values crosses either scale in a few presses.
const SLIDER_PAGE_STEP = 3;

// KeyboardEvent.key values that move the slider, and by how many values.
// RangeSlider takes these keys itself: the Slider's own steps are in points,
// not values, so they land between Fibonacci values — from 34 neither an arrow
// nor a Page key would ever reach 55.
export const SLIDER_STEP_DIRECTION = {
  ArrowRight: 1,
  ArrowUp: 1,
  ArrowLeft: -1,
  ArrowDown: -1,
  PageUp: SLIDER_PAGE_STEP,
  PageDown: -SLIDER_PAGE_STEP,
} as const;

// Two mutually exclusive options, so radios rather than the wireframe's
// "dropdown list" — both are worth seeing at once.
export const POINT_SYSTEM_OPTIONS = [
  { value: PointSystemType.NUMERICAL, label: "Numerical integers" },
  { value: PointSystemType.FIBONACCI, label: "Fibonacci sequence" },
] as const;

// Below this, the wait is a warm server and needs no explanation. Showing
// the notice anyway flashes it for a frame on every navigation.
export const LOADING_NOTICE_DELAY_MS = 400;

// How long ShareLink's copy button shows its confirmation tick.
export const COPIED_FEEDBACK_MS = 2000;

// REVEALED's entry is only a fallback. A revealed Square is filled by
// utils/grid.ts: one person's own colour, or a grey that deepens with the
// crowd.
export const CELL_CLASS = {
  [CellState.EMPTY]: "bg-neutral-200",
  [CellState.AREA]: "bg-neutral-400",
  [CellState.CHOSEN]: "bg-green-500 text-white",
  [CellState.REVEALED]: "bg-neutral-50",
} as const;

// Ring, not fill, so it can sit on top of a Selection's Area.
export const PREVIEW_CLASS = "ring-2 ring-neutral-500";

// The headcount at which a Square stops being one person's and becomes a
// crowd. Everything about a revealed Square turns on this: whether it wears
// someone's colour or a grey, whether its face says a name or a count, and
// whether clicking it opens the badges. It is also where CROWDED_SQUARE_CLASS
// below starts counting — a crowd of exactly this many takes its first entry.
export const CROWDED_SQUARE_MINIMUM = 2;

// A Square more than one person picked, by how many: two, three, four, then
// five or more. No one colour could stand for a crowd, so the Square goes grey
// and darkens as it fills — agreement reads as weight from across the room,
// and the names live in the badges a click away. Starts well below the empty
// Square's neutral-200 so even a pair of votes is unmistakable.
export const CROWDED_SQUARE_CLASS = [
  "bg-neutral-400 text-neutral-900",
  "bg-neutral-500 text-white",
  "bg-neutral-600 text-white",
  "bg-neutral-700 text-white",
] as const;

// On top of that grey: a rainbow that rolls around the Square's edge, so the
// Squares a team converged on are the ones that move. The utility itself is
// in src/index.css — it needs a masked pseudo-element and an @property angle,
// neither of which a utility class can express.
export const CROWDED_SQUARE_BORDER_CLASS = "rainbow-border";

// One colour per person on the ended screen: it fills their Square when they
// picked it alone, and badges their name in a crowded Square's tooltip.
// Sixteen Tailwind hues, none of them grey — grey belongs to the crowd — over
// the 300 and 400 shades, each paired with its own hue at 950 for text, which
// keeps a name legible without the washed-out look of grey on colour.
//
// The order here is the order people get them, starting from a per-Session
// point in the list: utils/participantColours.ts rotates it before handing it
// out. Past sixteen people it cycles.
//
// Whole literal class strings: Tailwind's scanner and `cn build` only see
// classes that appear in the source, so these can never be assembled at runtime.
export const PARTICIPANT_COLOUR_CLASS = [
  "bg-rose-400 text-rose-950",
  "bg-sky-400 text-sky-950",
  "bg-amber-400 text-amber-950",
  "bg-violet-300 text-violet-950",
  "bg-lime-400 text-lime-950",
  "bg-fuchsia-300 text-fuchsia-950",
  "bg-teal-400 text-teal-950",
  "bg-orange-300 text-orange-950",
  "bg-blue-300 text-blue-950",
  "bg-yellow-300 text-yellow-950",
  "bg-pink-400 text-pink-950",
  "bg-emerald-300 text-emerald-950",
  "bg-red-300 text-red-950",
  "bg-indigo-400 text-indigo-950",
  "bg-cyan-300 text-cyan-950",
  "bg-purple-400 text-purple-950",
] as const;

// No units: Time and Resources are labels, and the team decides (CONTEXT.md).
export const AXIS_HINT = {
  TIME: "Duration, not effort.",
  RESOURCES: "Anything the task needs, such as effort, people or dependencies.",
} as const;

// Vertical: writing-mode turns the text but leaves the icon upright, so
// rotate-180 flips it. The icon's own rotate-180 flips it back.
export const AXIS_TITLE_CLASS = {
  [AxisOrientation.HORIZONTAL]: { trigger: "", icon: "" },
  [AxisOrientation.VERTICAL]: {
    trigger: "rotate-180 [writing-mode:vertical-rl]",
    icon: "rotate-180",
  },
} as const;

// PointerEvent.pointerType for a mouse (Pointer Events spec). Touch and pen
// get no hover preview — a tap would leave it stuck on.
export const MOUSE_POINTER_TYPE = "mouse";

// A missing session is an expected answer from GET /sessions/:id, not a
// failure, so lib/api.ts checks for this status by name.
export const HTTP_NOT_FOUND = 404;
