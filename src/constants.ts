// The one home for every const object that replaces a magic string, plus the
// handful of values that come from the spec. Values only — the type derived
// from each lives in src/types/constants.ts.

import type { RevealPayload, Selection } from "@/types";

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
  SELECTION_ACKNOWLEDGED: "selection-acknowledged",
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

// What each point system is called on the Create form's segmented buttons and
// in the ready screen's summary line (DESIGN.md §7). The buttons sit in this
// object's order.
export const POINT_SYSTEM_LABEL = {
  [PointSystemType.NUMERICAL]: "Numerical",
  [PointSystemType.FIBONACCI]: "Fibonacci",
} as const;

// Which of the slider's values get a Silkscreen tick beneath the track (§7):
// every nth. Fibonacci's ten all fit; Numerical's twenty-one would run together
// on a phone, so it is labelled every fifth — 0, 5, 10, 15, 20.
export const SLIDER_TICK_EVERY = {
  [PointSystemType.NUMERICAL]: 5,
  [PointSystemType.FIBONACCI]: 1,
} as const;

// Below this, the wait is a warm server and needs no explanation. Showing
// the notice anyway flashes it for a frame on every navigation.
export const LOADING_NOTICE_DELAY_MS = 400;

// How long the copy button wears its `copied` fill and reads "Copied!"
// (DESIGN.md §7).
export const COPIED_FEEDBACK_MS = 1600;

// The three artboards the design is drawn at, and the widths where each takes
// over: ≤767 mobile · 768–1199 tablet · ≥1200 desktop (DESIGN.md §12). These
// mirror the `tablet` and `desktop` breakpoints in src/index.css — the CSS is
// what lays out the page; these are for code that has to measure.
export const BREAKPOINT_PX = {
  TABLET: 768,
  DESKTOP: 1200,
} as const;

// The crowd ramp: how many people landed on a Square, never Time or Resources
// (DESIGN.md §2). Index by headcount, capped at the last entry — 0 is the idle
// Square, 4 covers four or more. Text flips to white at crowd-3, where the
// fill finally goes dark enough to need it.
//
// Whole literal class strings: Tailwind's scanner and `cn build` only see
// classes that appear in the source.
export const CROWD_CLASS = [
  "bg-crowd-0 text-ink",
  "bg-crowd-1 text-ink",
  "bg-crowd-2 text-ink",
  "bg-crowd-3 text-white",
  "bg-crowd-4 text-white",
] as const;

// The ramp step a Square inside the Selection's Area wears while the Session
// runs (§6). The same lavender as one person in the Reveal.
export const SELECTION_AREA_CROWD_STEP = 1;

// Your own Selection while the Session runs.
export const SELECTION_SQUARE_CLASS = "bg-selection text-ink";

// The headcount at which a Square stops being one person's and becomes a
// crowd: its face says a count instead of a name.
export const CROWDED_SQUARE_MINIMUM = 2;

// Which artboard a viewport falls in (§5). Read from BREAKPOINT_PX by
// hooks/useBreakpoint.ts.
export const Breakpoint = {
  MOBILE: "mobile",
  TABLET: "tablet",
  DESKTOP: "desktop",
} as const;

// Square size per artboard (§5): min(max, floor((available − (n − 1) × gap) / n)).
// `available` is the grid's width budget inside the window.
export const SQUARE_FIT = {
  [Breakpoint.MOBILE]: { available: 298, max: 39 },
  [Breakpoint.TABLET]: { available: 580, max: 64 },
  [Breakpoint.DESKTOP]: { available: 630, max: 70 },
} as const;

// The Welcome page's "Why keep Selections private?" grids (§7 item 6). Two
// windows sit side by side on desktop, each in half the width a session window
// gets, so their Squares cap smaller — 50 / 48 / 36, off the artboards.
export const COMPARISON_SQUARE_FIT = {
  [Breakpoint.MOBILE]: { available: 298, max: 36 },
  [Breakpoint.TABLET]: { available: 580, max: 48 },
  [Breakpoint.DESKTOP]: { available: 630, max: 50 },
} as const;

export const SQUARE_GAP_PX = 4;

// The floor under the §5 formula. Numerical to 20 is a 21×21 grid, which the
// formula would shrink to 10px on a phone. Below this the grid scrolls
// sideways instead, so a Square stays a fingertip target on every device.
export const SQUARE_MIN_PX = 28;

// From this size a Square's face spells a name out; below it, initials (§6).
export const SQUARE_FULL_LABEL_MIN_PX = 56;

// How much of a face a Square has room for (§6 "Labels in the Reveal").
export const SquareLabelSize = {
  FULL: "full",
  COMPACT: "compact",
} as const;

export const SQUARE_LABEL_SIZE_CLASS = {
  [SquareLabelSize.FULL]: "text-[11px]",
  [SquareLabelSize.COMPACT]: "text-[10px]",
} as const;

// What your own Selection says on its face.
export const SELECTION_LABEL = {
  [SquareLabelSize.FULL]: "You",
  [SquareLabelSize.COMPACT]: "★",
} as const;

// Name lengths, ellipsis included (§6): a full Square face, and the tooltip.
export const SQUARE_NAME_MAX_CHARS = 8;
export const TOOLTIP_NAME_MAX_CHARS = 14;

// A small Square shows a lone name as its first letters: "Mia" → "Mi".
export const SQUARE_INITIALS_LENGTH = 2;

// What a Square is doing beyond its fill. LIFTED is hover, keyboard focus or
// a pinned popover; AREA_PREVIEW is inside the Area under the mouse.
export const SquareHighlight = {
  NONE: "none",
  AREA_PREVIEW: "areaPreview",
  LIFTED: "lifted",
} as const;

// `translate` rather than `transform`: Tailwind v4's translate utilities set
// the standalone property, so that is the one to transition (§8: 90ms lift,
// 120ms fill).
export const SQUARE_HIGHLIGHT_CLASS = {
  [SquareHighlight.NONE]: "z-0",
  [SquareHighlight.AREA_PREVIEW]: "z-0 shadow-area-preview",
  [SquareHighlight.LIFTED]:
    "z-10 -translate-x-[3px] -translate-y-[3px] shadow-px",
} as const;

// How a Square came to be hovered. The Area preview follows the mouse only.
export const HoverSource = {
  POINTER: "pointer",
  KEYBOARD: "keyboard",
} as const;

// An axis value lights up in `accent` while its row or column is hovered.
export const AxisValueEmphasis = {
  NONE: "none",
  ACTIVE: "active",
} as const;

export const AXIS_VALUE_EMPHASIS_CLASS = {
  [AxisValueEmphasis.NONE]: "text-ink",
  [AxisValueEmphasis.ACTIVE]: "text-accent",
} as const;

export const AXIS_LABEL = {
  TIME: "time →",
  RESOURCES: "resources ↑",
} as const;

// KeyboardEvent.key → the step it takes across the grid, in axis indexes.
// Resources runs bottom to top, so ArrowUp is +1.
export const GRID_ARROW_STEP = {
  ArrowLeft: { time: -1, resource: 0 },
  ArrowRight: { time: 1, resource: 0 },
  ArrowUp: { time: 0, resource: 1 },
  ArrowDown: { time: 0, resource: -1 },
} as const;

export const ESCAPE_KEY = "Escape";

// The tooltip and popover sit this far above their Square (§6).
export const FLOAT_OFFSET_PX = 12;

// The popover's name bullets alternate between these two (§6).
export const POPOVER_BULLET_CLASS = ["bg-selection", "bg-crowd-2"] as const;

// "Your Square" in the Reveal (§6): a 3px `selection` ring inset 7px, drawn
// over whatever crowd fill the Square has.
export const YOUR_SQUARE_CLASS =
  "outline-3 outline-solid outline-selection -outline-offset-7";

// The Reveal's diagonal wave (§8): each Square starts this much later than
// the one before it on the diagonal — (time index + resources index) × step.
// About 1.5s end to end on a 7×7.
export const REVEAL_WAVE_STEP_MS = 70;

// How much of an element counts as wholly on screen. Short of 1 because a
// box sitting on a sub-pixel edge can report 0.998 and never reach it.
export const FULLY_IN_VIEW_RATIO = 0.99;

// The Active and Reveal windows are one size (§5), and hold the same grid.
// The body is tighter than the Window default on mobile: a Fibonacci 7×7 at
// 39px needs 335px, and the default padding leaves 328.
export const SESSION_WINDOW_CLASS = {
  window: "w-full max-w-[366px] tablet:max-w-[740px] desktop:max-w-[780px]",
  body: "gap-3.5 px-3 pt-2.5 pb-3.5 desktop:px-9 desktop:pt-7",
} as const;

// The Create and Join windows (§5): narrower than a session's, since they hold
// a form rather than a grid. Both use the artboards' wider body from tablet up
// — 32/40/36 around a 24px gap — where the Window default is tuned tighter.
export const CREATE_WINDOW_CLASS =
  "w-full max-w-[366px] tablet:max-w-[600px] desktop:max-w-[640px]";

export const JOIN_WINDOW_CLASS = "w-full max-w-[366px] tablet:max-w-[560px]";

export const FORM_WINDOW_BODY_CLASS =
  "tablet:gap-6 tablet:px-10 tablet:pt-8 tablet:pb-9";

// The error window (§5, §7): the widest of the screens, since the broken grid
// sits beside the words from tablet up. On a phone it stacks above them.
export const ERROR_WINDOW_CLASS = {
  window: "w-full max-w-[366px] tablet:max-w-[740px] desktop:max-w-[900px]",
  body: "gap-6 px-[18px] pt-5 pb-5 tablet:flex-row tablet:items-center tablet:gap-10 tablet:px-9 tablet:pt-10 tablet:pb-10 desktop:gap-14 desktop:px-12 desktop:pt-10 desktop:pb-10",
} as const;

// One layout for every error, only the words change (§7). The label is both
// the window title and the Silkscreen line above the heading.
//
// Connection lost departs from §7's second sentence, "When you reconnect you'll
// join as a new Participant". Only an Admin sees this screen — a Participant is
// sent back to /join — and an Admin reconnects as the Admin, Selection intact.
// The screen also stands in for a backend that can't be reached at all, which
// on a free host is usually one still waking up.
export const ERROR_SCREEN_COPY = {
  NOT_FOUND: {
    label: "session not found",
    title: "Session not found",
    body: "This link doesn’t match a live session. Sessions live in memory, so a server restart or a mistyped link lands you here. Nothing was saved.",
  },
  CONNECTION_LOST: {
    label: "connection lost",
    title: "Connection lost",
    body: "We can’t reach the session right now. If the server is waking up, give it a moment and try again.",
  },
  SOMETHING_WENT_WRONG: {
    label: "something went wrong",
    title: "Something went wrong",
    body: "The session hit an error we didn’t expect. Try again, or start a fresh session.",
  },
} as const;

// The error screens' illustration (§7): a 5×5 grid with five Squares fallen out
// of it. Rows run top to bottom; each number is the Square's crowd step, and
// null is a gap — drawn as a dashed outline where a Square used to be.
export const BROKEN_GRID_STANDING = [
  [1, 0, 0, 0, null],
  [0, 2, 0, null, 1],
  [2, 0, null, 2, 0],
  [0, null, 0, 0, 0],
  [0, 0, 0, 2, null],
] as const;

// The five that fell, lying tilted in a heap below the grid. Positions are in
// Square pitches (a Square plus its gap) from the grid's top left, read off the
// desktop artboard — so one table draws all three sizes. One is the Selection.
export const BROKEN_GRID_FALLEN = [
  { column: 1.06, row: 5.26, rotationDegrees: 40, fillClass: CROWD_CLASS[1] },
  { column: 1.87, row: 5.78, rotationDegrees: 40, fillClass: CROWD_CLASS[1] },
  {
    column: 2.83,
    row: 5.43,
    rotationDegrees: 40,
    fillClass: SELECTION_SQUARE_CLASS,
  },
  { column: 4.04, row: 5.72, rotationDegrees: -12, fillClass: CROWD_CLASS[1] },
  { column: 3.83, row: 5.41, rotationDegrees: -12, fillClass: CROWD_CLASS[1] },
] as const;

// How tall the illustration is, in pitches: the grid and the heap beneath it.
export const BROKEN_GRID_HEIGHT_PITCHES = 6.9;

// Only keyboard focus counts as hover. A tap focuses a button too, and would
// leave a lifted Square and its tooltip stuck on a touch screen.
export const FOCUS_VISIBLE_SELECTOR = ":focus-visible";

// PointerEvent.pointerType for a mouse (Pointer Events spec). Touch and pen
// get no hover preview — a tap would leave it stuck on.
export const MOUSE_POINTER_TYPE = "mouse";

// A missing session is an expected answer from GET /sessions/:id, not a
// failure, so lib/api.ts checks for this status by name.
export const HTTP_NOT_FOUND = 404;

// The values the logo card flips to (DESIGN.md §1). The first eight Fibonacci
// numbers, but declared here rather than sliced off FIBONACCI_SEQUENCE: that
// one is the point system the server validates against, and the logo must not
// change shape the day the point system does.
export const LOGO_CARD_VALUES = [0, 1, 2, 3, 5, 8, 13, 21] as const;

// Where the mark rests between shakes (§1). The keyframes pass through this
// angle too, but it lives on the element so the tilt survives reduced motion,
// which strips the animation and leaves the resting transform alone.
export const LOGO_REST_ROTATION = "rotate(-8deg)";

// Depth for the flip. Without it rotateY reads as a horizontal squash rather
// than a card turning over (§8).
export const LOGO_PERSPECTIVE_PX = 240;

// The decorative cast around the window (§9). Each entry is one sprite and the
// literal classes that place it — `cn build` and Tailwind's scanner only see
// classes written in source, so these can never be assembled from a position.
//
// Desktop floats them around the edges; tablet lets them peek over the top and
// lean out of the sides; mobile keeps the top pair only. Everything here is
// hidden from screen readers by the sprite components themselves.
export const SPRITE_SCATTER_CLASS = {
  HIDDEN_BELOW_TABLET: "hidden tablet:block",
  HIDDEN_BELOW_DESKTOP: "hidden desktop:block",
  HIDDEN_ON_DESKTOP: "desktop:hidden",
  TABLET_ONLY: "hidden tablet:block desktop:hidden",
} as const;

// The three dots on the right of a Window's title bar, in the order they sit
// (DESIGN.md §2). Decorative: they are not buttons and nothing reads them.
export const WINDOW_CHROME_DOT_CLASS = [
  "bg-selection",
  "bg-chrome-green",
  "bg-danger",
] as const;

// A Chip's border treatment. Abstained is the dashed one — the design gives it
// a dashed `text-subtle` edge rather than the solid ink every other chip wears
// (§4), so a Participant who held no Selection reads as an absence.
export const ChipVariant = {
  SOLID: "solid",
  DASHED: "dashed",
} as const;

// Two heights, because chips do two jobs: a Silkscreen label inside a Window's
// title bar, and a person's name in the Reveal's "who landed where" row.
export const ChipSize = {
  LABEL: "label",
  NAME: "name",
} as const;

export const CHIP_VARIANT_CLASS = {
  [ChipVariant.SOLID]: "border-ink bg-white",
  [ChipVariant.DASHED]: "border-dashed border-text-subtle",
} as const;

export const CHIP_SIZE_CLASS = {
  [ChipSize.LABEL]: "px-[7px] py-0.5 font-label text-[11px]",
  [ChipSize.NAME]: "h-9 gap-2 px-2.5 font-body text-[14px] font-bold",
} as const;

// The loader at its two sizes (DESIGN.md §7): 220×18 in eight blocks centred in
// a window, and 40×6 in five inside a button or before a line of text.
export const PixelBarSize = {
  LARGE: "large",
  INLINE: "inline",
} as const;

// Whole literal class strings, as everywhere else — Tailwind's scanner and
// `cn build` only see classes written in source. `blocks` is the white gap
// overlay; its utility is in src/index.css, where the repeating gradient can be
// written out.
export const PIXEL_BAR_CLASS = {
  [PixelBarSize.LARGE]: {
    track: "h-[18px] w-[220px]",
    fill: "animate-pixel-bar-large",
    blocks: "pixel-bar-blocks-large",
  },
  [PixelBarSize.INLINE]: {
    track: "h-[6px] w-[40px]",
    fill: "animate-pixel-bar-inline",
    blocks: "pixel-bar-blocks-inline",
  },
} as const;

// The Welcome page's in-page anchors (§7): the header nav and the mobile menu
// link to them, and the sections carry them as ids.
export const WelcomeSection = {
  HOW_TO_PLAY: "how-to-play",
  WHY_PRIVATE: "why-private",
  WHY_I_MADE_THIS: "why-i-made-this",
} as const;

// A section the header links to lands below the sticky header rather than
// under it — one margin per Welcome header height (§5: 64 / 72 / 84).
export const WELCOME_ANCHOR_CLASS =
  "scroll-mt-16 tablet:scroll-mt-[72px] desktop:scroll-mt-[84px]";

// Welcome's header is taller than every other screen's (§5), and its sides
// widen to the page's 80px padding on desktop.
export const WELCOME_HEADER_CLASS =
  "h-16 tablet:h-[72px] desktop:h-[84px] desktop:px-20";

// The page's side padding (§5: 20 / 40 / 80), shared by every Welcome section.
export const WELCOME_GUTTER_CLASS = "px-5 tablet:px-10 desktop:px-20";

// Where the two repos live. The Welcome page's repo cards, header and menu
// link to them (§7 item 7); the handle is the one the frontend's own remote
// points at.
export const REPOSITORY_URL = {
  FRONTEND: "https://github.com/rachelwong/estimator-frontend",
  BACKEND: "https://github.com/rachelwong/estimator-backend",
  MAIN: "https://github.com/rachelwong",
  PORTFOLIO: "https://www.rachelwong.dev/",
} as const;

// The band where the Welcome page's lavender top breaks into pixels over the
// cream below (§7 item 4): a Bayer 4×4 ordered dither, one tile per 4×4 cells.
// Each 4-row block keeps a cell where its matrix value reaches that block's
// threshold — 7/8, then 1/2, then 1/8 of the cells, read off the artboard.
export const DITHER_BAYER_MATRIX = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
] as const;

export const DITHER_BLOCK_THRESHOLDS = [2, 8, 14] as const;

// One cell of the dither — 12 rows of them make the 144px band.
export const DITHER_PIXEL_PX = 12;

// The sample Session the Welcome page demonstrates with (§7 items 3 and 6).
// Real data shapes, so the demos are the real grid and Reveal window rather
// than pictures of them. Fibonacci to 13: a 7×7, the grid every artboard draws.
export const WELCOME_DEMO_AXIS_VALUES: number[] = [0, 1, 2, 3, 5, 8, 13];

export const WELCOME_DEMO_REVEAL: RevealPayload = {
  squares: [
    { time: 8, resource: 5, names: ["Jim-2"] },
    { time: 5, resource: 3, names: ["Mia", "Jim-1", "Noor"] },
    { time: 5, resource: 2, names: ["Ben"] },
    { time: 3, resource: 2, names: ["Priya"] },
    { time: 5, resource: 1, names: ["Sam"] },
  ],
  abstained: ["Alex"],
};

// The hero's Reveal opens on the crowded Square, its popover already pinned.
export const WELCOME_DEMO_PINNED: Selection = { time: 5, resource: 3 };

// Where "While you pick" starts: a Selection with its Area around it.
export const WELCOME_DEMO_SELECTION: Selection = { time: 8, resource: 5 };

// The Welcome page's type scale (§3): a section heading — 27 / 36 / 44 — and a
// card or sub heading — 17 / 19 / 20.
export const WELCOME_SECTION_HEADING_CLASS =
  "font-display text-[27px] leading-[1.05] text-ink tablet:text-[36px] desktop:text-[44px]";

export const WELCOME_CARD_HEADING_CLASS =
  "font-display text-[17px] leading-[1.1] text-ink tablet:text-[19px] desktop:text-[20px]";

// The body of the two windows in "Why keep Selections private?": tighter than
// the Window default, around a grid capped by COMPARISON_SQUARE_FIT.
export const COMPARISON_WINDOW_BODY_CLASS =
  "items-center gap-3 px-3.5 pt-3.5 pb-3.5 tablet:gap-3 tablet:px-6 tablet:pt-6 tablet:pb-6 desktop:px-6 desktop:pt-6 desktop:pb-6";
