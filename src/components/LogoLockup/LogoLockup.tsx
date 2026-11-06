import wordmark from "@/assets/sprites/work/wordmark.svg";
import { Sprite } from "@/components/Sprite";
import { Theme } from "@/constants";
import { useContent, useTheme } from "@/hooks";
import { cn } from "@/lib/utils";
import { LogoMark } from "./LogoMark";

interface LogoLockupProps {
  className?: string;
}

// Mark + wordmark, 10-12px apart, the name in Bungee (DESIGN.md §1). The mark
// carries the whole brand on its own, so the gap and the type size are the only
// things this adds.
//
// The mark's width drives its own number size — the card back is a size
// container — so scaling the lockup is one class on the mark.
//
// Work swaps the whole lockup for the FOLD / FLIP wordmark (NL-* headers), 22px
// tall at every width. It stands still, so the card's 7s cycle doesn't run.
// The link around it carries the name, so the sprite stays decorative.
export function LogoLockup({ className }: LogoLockupProps) {
  const content = useContent();
  const { theme } = useTheme();

  if (theme === Theme.WORK) {
    return <Sprite source={wordmark} className={cn("block h-[22px] w-auto", className)} />;
  }

  return (
    <span className={cn("inline-flex items-center gap-4", className)}>
      <LogoMark className="h-10 w-[30px] tablet:h-12 tablet:w-9" />

      <span className="font-display text-[20px] leading-none text-foreground tablet:text-[24px]">
        {content.brand.name}
      </span>
    </span>
  );
}
