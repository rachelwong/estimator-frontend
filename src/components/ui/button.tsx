import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

// Fold and Flip's button (DESIGN.md §4): 3px edge, a 4px offset shadow,
// square corners. Pressing it moves the button onto its own shadow, which is
// the whole depth model of this design — nothing ripples. Hover dims it a shade,
// eased rather than snapped.
//
// Work (NL-Components) keeps the shape and drops the depth: a 1px edge, 6px
// corners, no shadow, a 2px focus ring close in, and hover changes the fill
// rather than dimming it. Its labels are Red Hat Text 500, whatever face the
// caller asks for in Play.
//
// The shadcn source stays, restyled in place, so the primitives that compose it
// (alert-dialog) keep working. What went with the restyle: the `link` and
// `outline` variants and every size but the three the design draws. They had
// no caller, and a variant nobody uses is a variant nobody has checked against
// the palette.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-control border-[3px] whitespace-nowrap shadow-control transition-[translate,box-shadow,background-color,filter] outline-none select-none hover:brightness-95 focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ring active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px] work:border work:font-body work:font-medium work:hover:brightness-100 work:focus-visible:outline-2 work:focus-visible:outline-offset-2 work:active:translate-0 work:[&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border-action-border bg-action text-action-foreground hover:bg-action-hover",
        secondary: "border-secondary-border bg-secondary text-foreground hover:bg-secondary-hover",
        // The second choice beside a primary: Cancel, Back to Home, How to use.
        // The secondary look in Play; Work draws it as an outline on the page.
        ghost: "border-ghost-border bg-ghost text-ghost-foreground hover:bg-ghost-hover",
        destructive: "border-emphasis-border bg-emphasis text-emphasis-foreground hover:bg-emphasis-hover",
        // "Start a new session" on the Reveal: yellow like `default` in Play, but the
        // one decisive CTA in Work, so it has its own roles.
        newSession: "border-new-session-border bg-new-session text-new-session-foreground hover:bg-new-session-hover",
        // The share bar's Copy link: yellow like `default` in Play, a ghost in Work.
        copy: "border-copy-border bg-copy text-copy-foreground hover:bg-copy-hover",
      },
      size: {
        // 44px: the header's own row height, and the minimum touch target.
        default: "h-11 px-4 font-body text-[15px] font-extrabold work:px-5",
        // The full-width call to action at the end of a form, in Bungee.
        lg: "h-14 px-6 font-display text-[17px] tablet:text-[18px] work:h-12 work:px-5 work:text-[15px] work:tablet:text-[15px]",
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
