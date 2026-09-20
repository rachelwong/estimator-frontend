import * as React from "react"
import { cn } from "@/lib/utils"

// Fold and Flip's input (DESIGN.md §4): the same 3px ink edge and square
// corners as a button, and deliberately no shadow — a field is a hole in the
// page, not something sitting on top of it.
//
// Focus is an offset ink outline rather than a ring, so it reads as one of the
// design's own hard edges instead of a soft glow.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 border-[3px] border-ink bg-white px-3.5 font-body text-[17px] text-ink transition-colors outline-none placeholder:text-text-subtle focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ink disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger tablet:h-13",
        className
      )}
      {...props}
    />
  )
}

export { Input }
