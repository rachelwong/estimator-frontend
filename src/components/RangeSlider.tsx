import { cn } from "@/lib/utils";
import type { PointSystemType } from "@/types";
import { pointSystemValues, sliderTickIndexes } from "@/utils";
import type { CSSProperties } from "react";
import { useId } from "react";

interface RangeSliderProps {
  pointSystemType: PointSystemType;
  value: number;
  onChange: (value: number) => void;
}

// The pixel slider (DESIGN.md §7): a 10px track filled `accent` up to the
// thumb, a 28px square white thumb, and Silkscreen ticks beneath.
//
// The track steps by index, not by magnitude, so every value sits the same
// distance from the next — Fibonacci's 34 and 55 are one notch apart, the same
// as 0 and 1. That is what lets a tick sit under each value, and it means an
// arrow key, a Page key or a drag can only ever land on a value the grid uses.
//
// A native range input, so the browser supplies the keyboard, pointer and
// accessibility behaviour. Its own value is the index; `aria-valuetext` tells a
// screen reader the axis value instead, and a hidden input submits it.
//
// Which values exist depends on the point system, so the two controls are
// co-dependent. Resetting the value on a switch is the caller's job — this
// component only renders what it is given.
export function RangeSlider({
  pointSystemType,
  value,
  onChange,
}: RangeSliderProps) {
  const id = useId();
  const values = pointSystemValues(pointSystemType);
  const lastIndex = values.length - 1;
  const index = values.indexOf(value);

  // The thumb's centre, as a share of the track. Ticks use it for their place,
  // the track for how far its fill runs.
  const position = (at: number) => (at / lastIndex) * 100;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-[15px] font-extrabold">
          Max story point value
        </label>
        <span className="font-display text-[23px] text-accent tabular-nums">
          {value}
        </span>
      </div>

      <div className="flex h-11 items-center">
        <input
          id={id}
          type="range"
          min={0}
          max={lastIndex}
          step={1}
          value={index}
          aria-valuetext={String(value)}
          onChange={(event) => onChange(values[Number(event.target.value)])}
          className="pixel-slider"
          style={{ "--slider-fill": `${position(index)}%` } as CSSProperties}
        />
        <input type="hidden" name="sliderMax" value={value} />
      </div>

      {/* Inset by half the thumb, which is how far its centre can travel. */}
      <div
        aria-hidden="true"
        className="relative mx-3.5 h-3.5 font-label text-[11px]"
      >
        {sliderTickIndexes(pointSystemType, values.length).map((tick) => (
          <span
            key={tick}
            className={cn(
              "absolute top-0 -translate-x-1/2",
              tick === index ? "text-accent" : "text-ink",
            )}
            style={{ left: `${position(tick)}%` }}
          >
            {values[tick]}
          </span>
        ))}
      </div>
    </div>
  );
}
