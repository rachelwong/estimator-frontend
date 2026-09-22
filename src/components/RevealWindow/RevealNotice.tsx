import spade from "@/assets/sprites/spade.svg";
import { Sprite } from "@/components/Sprite";

// The dark notice at the top of the Reveal (DESIGN.md §7): ink, an accent
// shadow, and a white spade, since the ink one would vanish here.
export function RevealNotice() {
  return (
    <div className="flex items-start gap-3.5 bg-ink px-3.5 py-3 text-cream shadow-px-accent tablet:px-[18px] tablet:py-4">
      <Sprite source={spade} className="size-[22px] shrink-0" />

      <div className="flex flex-col gap-1">
        <strong className="text-[15px]">Estimating is closed</strong>
        <p className="text-[14px] leading-[1.45] text-on-ink-muted">
          The Admin ended this session, so every Estimate is locked in. Pick a
          Square to see who landed there.
        </p>
      </div>
    </div>
  );
}
