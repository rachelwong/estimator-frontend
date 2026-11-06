import spade from "@/assets/sprites/spade.svg";
import { Sprite } from "@/components/Sprite";
import { useContent } from "@/hooks";

interface RevealNoticeProps {
  body: string;
}

// The dark notice at the top of the Reveal (DESIGN.md §7): ink, an accent
// shadow, and a white spade, since the ink one would vanish here.
//
// Work has no notice box (NL-Reveal-*): the same two lines stand on the card
// as the screen's heading and intro, the way Active's do.
export function RevealNotice({ body }: RevealNoticeProps) {
  const content = useContent();

  return (
    <div className="flex items-start gap-3.5 rounded-panel bg-inverse px-3.5 py-3 text-inverse-foreground shadow-float tablet:px-[18px] tablet:py-4 work:rounded-none work:bg-transparent work:p-0 work:pr-20 work:text-foreground work:shadow-none work:tablet:p-0 work:tablet:pr-24">
      <Sprite source={spade} className="size-[22px] shrink-0 work:hidden" />

      <div className="flex flex-col gap-1 work:gap-2">
        <strong className="text-[15px] work:font-display work:text-[24px] work:leading-[1.2] work:font-medium work:tracking-[-0.01em] work:tablet:text-[28px]">{content.reveal.noticeHeading}</strong>
        <p className="text-[14px] leading-[1.45] text-inverse-muted work:max-w-[600px] work:leading-[22px] work:text-muted-foreground work:tablet:text-[15px] work:tablet:leading-6">{body}</p>
      </div>
    </div>
  );
}
