import stepBadge from "@/assets/sprites/work/step-badge.svg";
import { Card } from "@/components/Card";
import { Sprite } from "@/components/Sprite";
import { useContent } from "@/hooks";
import { cn } from "@/lib/utils";
import parse from "html-react-parser";

interface HowToUseCardProps {
  level: number;
  title: string;
  /** HTML from content: a sentence or two, and maybe a link. */
  description: string;
  /** A `.svg` imported from `@/assets/sprites`. */
  sprite: string;
  /** The card's fill — one of the four How to use tints (§2). */
  tintClass: string;
}

// One step of How to use (§7 item 5): an ink "LV.n" tag and a sprite across
// the top, then the step's name and a sentence about it.
//
// Hovered, it slides 6px down onto its shadow — a Square's hover lift run in
// reverse, at the same 90ms.
//
// Work (NL-Welcome-*) has no sprite, and the tag becomes a 28px blue badge
// carrying the bare numeral; the full step label stays for screen readers.
export function HowToUseCard({
  level,
  title,
  description,
  sprite,
  tintClass,
}: HowToUseCardProps) {
  const content = useContent();

  return (
    <li className="flex">
      <Card
        className={cn(
          "flex w-full flex-col gap-3.5 transition-[translate,box-shadow] duration-[90ms] hover:translate-x-[6px] hover:translate-y-[6px] hover:shadow-none work:gap-3 work:rounded-bar work:p-6 work:hover:translate-0 work:tablet:p-6 work:desktop:p-6",
          tintClass,
        )}
      >
        <div className="flex items-start justify-between">
          <span className="bg-inverse px-2 py-1 font-label text-[13px] text-inverse-foreground work:hidden">
            {content.welcome.howToUse.stepLabel(level)}
          </span>
          <span className="relative hidden size-7 place-items-center font-display text-[14px] font-semibold text-link tabular-nums work:grid">
            <Sprite source={stepBadge} className="absolute inset-0" />
            <span className="sr-only">{content.welcome.howToUse.stepLabel(level)}</span>
            <span aria-hidden="true" className="relative">
              {level}
            </span>
          </span>
          <Sprite source={sprite} className="h-auto w-[52px] tablet:w-16 work:hidden" />
        </div>

        <h3
          className={
            "font-display text-[17px] leading-[1.1] text-foreground tablet:text-[19px] desktop:text-[20px] work:text-[18px] work:leading-[1.33] work:font-medium work:tablet:text-[18px] work:desktop:text-[18px]"
          }
        >
          {title}
        </h3>
        <p className="text-[16px] leading-[1.55] text-muted-foreground work:text-[15px] work:leading-6">{parse(description)}</p>
      </Card>
    </li>
  );
}
