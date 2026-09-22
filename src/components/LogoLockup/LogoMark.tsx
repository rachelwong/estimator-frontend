import logoCardBack from "@/assets/sprites/logo-card-back-blank.svg";
import logoCardFront from "@/assets/sprites/logo-card.svg";
import { Sprite } from "@/components/Sprite";
import { cn } from "@/lib/utils";
import { firstLogoValue, nextLogoValue } from "@/utils";
import { useState } from "react";

interface LogoMarkProps {
  className?: string;
}

// The animated mark: a playing card resting at -8deg that every 7s shakes,
// flips to a random value, holds, and flips back to the spade (DESIGN.md §1).
//
//   outer  shake + perspective   -- tilt lives here, so it survives reduced motion
//     └ inner  flip + preserve-3d  -- both faces are backface-hidden
//         ├ front  the spade card
//         └ back   blank card + number, pre-rotated 180deg
//
// The two animations share one 7s timeline, declared in src/index.css.
export function LogoMark({ className }: LogoMarkProps) {
  const [value, setValue] = useState(firstLogoValue);

  // ffFlip ends with the card back at 360deg, so the iteration event fires
  // while the spade faces out — the number can be swapped without it being
  // seen changing mid-flip (§8).
  function pickNext() {
    setValue(nextLogoValue);
  }

  return (
    // perspective sits on the shake element because it only reaches direct
    // children, and the flip is one of those (§8).
    <span
      className={cn("inline-block animate-logo-shake", className)}
      style={{
        perspective: `240px`,
        transform: "rotate(-8deg)",
      }}
    >
      <span
        className="relative block h-full w-full animate-logo-flip [transform-style:preserve-3d]"
        onAnimationIteration={pickNext}
      >
        <Sprite
          source={logoCardFront}
          className="block h-full w-full [backface-visibility:hidden]"
        />

        {/* A size container, so the number is half the card's width at any
            mark size — wide enough for "21" to sit inside the card's edge. */}
        <span className="@container absolute inset-0 grid place-items-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <Sprite
            source={logoCardBack}
            className="absolute inset-0 h-full w-full"
          />
          <span className="relative font-display text-[50cqw] leading-none text-ink">
            {value}
          </span>
        </span>
      </span>
    </span>
  );
}
