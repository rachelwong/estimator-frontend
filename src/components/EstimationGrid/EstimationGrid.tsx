import { Fragment, useEffect, useReducer, useRef, useState } from 'react'
import type { AnimationEvent, FocusEvent, KeyboardEvent, PointerEvent } from 'react'
import {
  AXIS_LABEL,
  FOCUS_VISIBLE_SELECTOR,
  GRID_ARROW_STEP,
  GridMode,
  HoverSource,
  MOUSE_POINTER_TYPE,
  SQUARE_GAP_PX,
} from '@/constants'
import { useBreakpoint, useEscapeKey, useFullyInView } from '@/hooks'
import type { GridMode as GridModeValue, HoveredSquare, RevealPayload, Selection } from '@/types'
import {
  axisEmphasis,
  groupNames,
  isSameSquare,
  labelSize,
  nextPinned,
  popoverTitle,
  revealDelay,
  squareAriaLabel,
  squareFillClass,
  squareHighlight,
  squareKey,
  squareLabel,
  squareSelector,
  squareSize,
  stepSquare,
  tooltipText,
} from '@/utils'
import { AxisValue } from './AxisValue'
import { GridCell } from './GridCell'
import { SquarePopover } from './SquarePopover'
import { SquareTooltip } from './SquareTooltip'

interface EstimationGridProps {
  axisValues: number[]
  mode: GridModeValue
  /** Running: the Selection you hold. Revealed: the one you held, if known. */
  selection?: Selection | null
  reveal?: RevealPayload
  onSelect?: (selection: Selection) => void
  /** Mouse over or keyboard focus: lifts the Square, shows its tooltip. */
  hovered: HoveredSquare | null
  onHoveredChange: (hovered: HoveredSquare | null) => void
  /** Reveal only: the Square whose popover is open. */
  pinned?: Selection | null
  onPinnedChange?: (pinned: Selection | null) => void
  /** Reveal only: hold the wave, and any pinned popover, until the grid is wholly on screen. */
  holdsWaveUntilInView?: boolean
}

// Time runs left to right, Resources bottom to top — origin bottom-left:
//
//   Resources
//       8 │ ·  ·  ·
//       4 │ ·  ·  ·
//       0 │ ·  ·  ·
//         └─────────
//           0  4  8   Time
//
// axisValues stays ascending, as on the wire. Only the rows reverse, and only
// here. A Selection's resource is always an axis value, never a row index.
//
// One Tab stop for the whole grid (roving tabIndex); arrows move between
// Squares, Enter/Space presses the focused one (§6).
//
// Hover and pin belong to the caller: the Reveal's "who landed where" chips
// preview and pin a Square from outside the grid.
export function EstimationGrid({
  axisValues,
  mode,
  selection = null,
  reveal,
  onSelect,
  hovered,
  onHoveredChange,
  pinned = null,
  onPinnedChange,
  holdsWaveUntilInView = false,
}: EstimationGridProps) {
  // The Square that holds the Tab stop. Until one is touched, the Selection.
  const [cursor, setCursor] = useState<Selection | null>(null)
  // The tooltip and popover follow their Square as the grid scrolls sideways.
  const [, rerender] = useReducer((tick: number) => tick + 1, 0)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const breakpoint = useBreakpoint()

  const rows = [...axisValues].reverse()
  const cols = axisValues
  const namesBySquare = groupNames(reveal)
  const isInteractive = mode === GridMode.INTERACTIVE
  const size = squareSize(axisValues.length, breakpoint)
  const faceSize = labelSize(size)
  const originSquare = { time: axisValues[0], resource: axisValues[0] }
  const tabStop = cursor ?? selection ?? originSquare

  // A held wave waits blank for the whole grid to scroll into view, then rolls
  // once. A pin it opened with stays shut until the last Square lands, rather
  // than floating over blank ones — the Welcome demo opens pinned.
  const isWaveStarted = useFullyInView(scrollerRef, holdsWaveUntilInView)
  const [isWaveLanded, setWaveLanded] = useState(!holdsWaveUntilInView)
  const lastAxisValue = axisValues[axisValues.length - 1]
  const lastSquareKey = squareKey(lastAxisValue, lastAxisValue)
  const shownPinned = isWaveLanded ? pinned : null

  // No tooltip over the pinned Square: its popover already says who's there.
  const hoveredSquare = hovered?.square ?? null
  const isHoveringPinned =
    hoveredSquare !== null && shownPinned !== null && isSameSquare(shownPinned, hoveredSquare)
  const tooltipSquare = isHoveringPinned ? null : hoveredSquare

  const template = `repeat(${axisValues.length}, ${size}px)`

  function namesAt(square: Selection): string[] {
    return namesBySquare.get(squareKey(square.time, square.resource)) ?? []
  }

  useEscapeKey(pinned ? () => onPinnedChange?.(null) : null)

  // A chip can pin a Square scrolled out of sight — on a phone, sideways in
  // the grid or up the page. Bring it back so its popover isn't opened blind.
  // A no-op for a Square clicked where it sits, which is already in view.
  //
  // Only a pin that changes, not one the grid mounts with: the Welcome page's
  // demo opens pinned, and scrolling to it would drag a phone's page down to
  // the demo on arrival.
  const pinnedSelector = pinned && squareSelector(pinned)
  const scrolledSelectorRef = useRef(pinnedSelector)
  useEffect(() => {
    if (pinnedSelector && pinnedSelector !== scrolledSelectorRef.current) {
      scrollerRef.current
        ?.querySelector(pinnedSelector)
        ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    }

    scrolledSelectorRef.current = pinnedSelector
  }, [pinnedSelector])

  // The far corner is the wave's last Square, so its end is the wave's end.
  function handleWaveEnd(event: AnimationEvent<HTMLDivElement>) {
    if (event.target instanceof HTMLElement && event.target.dataset.square === lastSquareKey) {
      setWaveLanded(true)
    }
  }

  // Running: choose it. Revealed: toggle its popover.
  function handleClick(square: Selection) {
    setCursor(square)

    if (isInteractive) {
      onSelect?.(square)
      return
    }

    onPinnedChange?.(nextPinned(pinned, square, namesAt(square)))
  }

  // Mouse only: a tap fires pointerenter too, and would leave a lift stuck on.
  function handlePointerEnter(event: PointerEvent, square: Selection) {
    if (event.pointerType !== MOUSE_POINTER_TYPE) {
      return
    }

    // Revealed, a Square nobody landed on has nothing to say: no lift, no
    // tooltip. Cleared rather than skipped, or the last Square stays lifted.
    if (!isInteractive && namesAt(square).length === 0) {
      onHoveredChange(null)
      return
    }

    onHoveredChange({ square, source: HoverSource.POINTER })
  }

  function handleFocus(event: FocusEvent<HTMLButtonElement>, square: Selection) {
    setCursor(square)

    if (event.currentTarget.matches(FOCUS_VISIBLE_SELECTOR)) {
      onHoveredChange({ square, source: HoverSource.KEYBOARD })
    }
  }

  function handleBlur() {
    if (hovered?.source === HoverSource.KEYBOARD) {
      onHoveredChange(null)
    }
  }

  // Arrows move focus to the neighbouring Square, held at the edges.
  function handleArrowKey(event: KeyboardEvent, square: Selection) {
    const step = GRID_ARROW_STEP[event.key as keyof typeof GRID_ARROW_STEP]

    if (!step) {
      return
    }

    event.preventDefault()
    const next = stepSquare(axisValues, square, step)
    scrollerRef.current?.querySelector<HTMLButtonElement>(squareSelector(next))?.focus()
  }

  return (
    // min-w-0: as a grid or flex item it would otherwise refuse to shrink below
    // its Squares, and push the page sideways instead of scrolling itself.
    <div className="relative flex min-w-0 flex-col gap-2">
      <span className="font-label text-[11px] tablet:hidden">{AXIS_LABEL.RESOURCES}</span>

      <div className="flex justify-center gap-2">
        <div className="hidden w-[18px] shrink-0 items-center tablet:flex">
          <span className="rotate-180 font-label text-[11px] [writing-mode:vertical-rl]">
            {AXIS_LABEL.RESOURCES}
          </span>
        </div>

        {/* pt-1 matches the scroller's padding, so each value sits on its row. */}
        <div
          className="grid w-[22px] shrink-0 justify-items-end pt-1"
          style={{ gridTemplateRows: template, gap: SQUARE_GAP_PX }}
        >
          {rows.map((resource) => (
            <AxisValue
              key={resource}
              value={resource}
              emphasis={axisEmphasis(resource, hovered?.square.resource)}
            />
          ))}
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          {/* Scrolls sideways once the Squares hit SQUARE_MIN_PX. The padding
              keeps a lifted Square's offset and shadow inside the clip. */}
          <div
            ref={scrollerRef}
            className="overflow-x-auto p-1"
            onScroll={hovered || pinned ? rerender : undefined}
          >
            {/* Cleared on leaving the whole grid, not each Square, so the
                preview doesn't flicker across the gutters. */}
            <div
              className="grid"
              style={{ gridTemplateColumns: template, gap: SQUARE_GAP_PX }}
              onAnimationEnd={isWaveLanded ? undefined : handleWaveEnd}
              onPointerLeave={() => {
                if (hovered?.source === HoverSource.POINTER) {
                  onHoveredChange(null)
                }
              }}
            >
              {rows.map((resource) => (
                <Fragment key={resource}>
                  {cols.map((time) => {
                    const square = { time, resource }
                    const names = namesAt(square)
                    const isPinned = Boolean(shownPinned && isSameSquare(shownPinned, square))

                    return (
                      <GridCell
                        key={time}
                        squareKey={squareKey(time, resource)}
                        size={size}
                        label={squareLabel(mode, square, selection, names, faceSize)}
                        labelSize={faceSize}
                        fillClass={squareFillClass(mode, square, selection, names)}
                        highlight={squareHighlight(mode, square, hovered, shownPinned)}
                        ariaLabel={squareAriaLabel(mode, square, selection, names)}
                        pressed={isInteractive ? Boolean(selection && isSameSquare(selection, square)) : undefined}
                        expanded={!isInteractive && names.length > 0 ? isPinned : undefined}
                        revealDelay={isInteractive ? undefined : revealDelay(axisValues, square)}
                        isWavePaused={!isWaveStarted}
                        hasPointerCursor={isInteractive || names.length > 0}
                        tabIndex={isSameSquare(tabStop, square) ? 0 : -1}
                        onClick={() => handleClick(square)}
                        onPointerEnter={(event) => handlePointerEnter(event, square)}
                        onFocus={(event) => handleFocus(event, square)}
                        onBlur={handleBlur}
                        onKeyDown={(event) => handleArrowKey(event, square)}
                      />
                    )
                  })}
                </Fragment>
              ))}
            </div>

            <div
              className="mt-1.5 grid justify-items-center"
              style={{ gridTemplateColumns: template, gap: SQUARE_GAP_PX }}
            >
              {cols.map((time) => (
                <AxisValue key={time} value={time} emphasis={axisEmphasis(time, hovered?.square.time)} />
              ))}
            </div>
          </div>

          <span className="self-end font-label text-[11px]">{AXIS_LABEL.TIME}</span>
        </div>
      </div>

      {tooltipSquare && (
        <SquareTooltip
          anchorKey={squareKey(tooltipSquare.time, tooltipSquare.resource)}
          boundsRef={scrollerRef}
          text={tooltipText(mode, tooltipSquare, namesAt(tooltipSquare))}
        />
      )}

      {shownPinned && (
        <SquarePopover
          anchorKey={squareKey(shownPinned.time, shownPinned.resource)}
          boundsRef={scrollerRef}
          title={popoverTitle(shownPinned)}
          names={namesAt(shownPinned)}
        />
      )}
    </div>
  )
}
