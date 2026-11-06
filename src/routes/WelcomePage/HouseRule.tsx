import { Sprite } from "@/components/Sprite";
import parse from "html-react-parser";

interface HouseRuleProps {
  /** A `.svg` imported from `@/assets/sprites`. */
  sprite: string;
  title: string;
  description: string;
}

// One house rule: a sprite beside a bold line and a sentence. A Card's edge
// without its shadow or its hover, as the artboard draws it — flatter than the
// How to use cards above, so the six read as a list rather than six more steps.
export function HouseRule({ sprite, title, description }: HouseRuleProps) {
  return (
    <li className="flex w-full items-start gap-[18px] rounded-bar border-[3px] border-border-subtle bg-card p-[22px] work:flex-col work:gap-0 work:overflow-hidden work:rounded-card work:border work:p-0">
      <Sprite source={sprite} className="h-auto w-12 shrink-0 work:hidden" />

      <div className="flex flex-col gap-1.5 work:px-[22px] work:pt-5 work:pb-[22px]">
        <strong className="text-[18px] work:font-display work:text-[17px] work:leading-[1.35] work:font-medium">{title}</strong>
        <p className="text-[15px] leading-[1.55] text-muted-foreground work:leading-6">
          {parse(description)}
        </p>
      </div>
    </li>
  );
}
