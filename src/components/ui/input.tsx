import { cn } from "@/lib/utils";
import * as React from "react";

// Fold and Flip's input (DESIGN.md §4): the same 3px ink edge and square
// corners as a button, and deliberately no shadow — a field is a hole in the
// page, not something sitting on top of it.
//
// Focus is an offset ink outline rather than a ring, so it reads as one of the
// design's own hard edges instead of a soft glow.
//
// Work (NL-Components) is the soft glow: a 1px edge that lightens on hover,
// and on focus turns `ring` inside a 3px `ring-halo`, with no outline. One
// height, 44px, at every width.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-control border-[3px] border-border bg-input px-3.5 font-body text-[17px] text-foreground transition-colors outline-none placeholder:text-placeholder focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive tablet:h-13 work:border work:px-3 work:text-[15px] work:tablet:h-11 work:hover:border-border-hover work:focus-visible:border-ring work:focus-visible:shadow-[0_0_0_3px_var(--ring-halo)] work:focus-visible:outline-none work:aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
