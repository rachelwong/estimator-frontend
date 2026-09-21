import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

// Fold and Flip's button (DESIGN.md §4): 3px ink edge, a 4px offset shadow,
// square corners. Pressing it moves the button onto its own shadow, which is
// the whole depth model of this design — nothing ripples. Hover dims it a shade,
// eased rather than snapped.
//
// The shadcn source stays, restyled in place, so the primitives that compose it
// (alert-dialog) keep working. What went with the restyle: the `ghost`, `link`
// and `outline` variants and every size but the three the design draws. They
// had no caller, and a variant nobody uses is a variant nobody has checked
// against the palette.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 border-[3px] border-ink whitespace-nowrap shadow-px transition-[translate,box-shadow,background-color,filter] outline-none select-none hover:brightness-95 focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ink active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px]",
  {
    variants: {
      variant: {
        default: "bg-selection text-ink",
        secondary: "bg-white text-ink",
        destructive: "bg-danger text-ink",
      },
      size: {
        // 44px: the header's own row height, and the minimum touch target.
        default: "h-11 px-4 font-body text-[15px] font-extrabold",
        // The full-width call to action at the end of a form, in Bungee.
        lg: "h-14 px-6 font-display text-[17px] tablet:text-[18px]",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
