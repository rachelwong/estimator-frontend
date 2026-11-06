import spade from "@/assets/sprites/spade.svg";
import { Sprite } from "@/components/Sprite";
import { useContent } from "@/hooks";

interface RevealNoticeProps {
  body: string;
}

// The dark notice at the top of the Reveal (DESIGN.md §7): ink, an accent
// shadow, and a white spade, since the ink one would vanish here.
export function RevealNotice({ body }: RevealNoticeProps) {
  const content = useContent();

  return (
    <div className="flex items-start gap-3.5 rounded-panel bg-inverse px-3.5 py-3 text-inverse-foreground shadow-float tablet:px-[18px] tablet:py-4">
      <Sprite source={spade} className="size-[22px] shrink-0" />

      <div className="flex flex-col gap-1">
        <strong className="text-[15px]">{content.reveal.noticeHeading}</strong>
        <p className="text-[14px] leading-[1.45] text-inverse-muted">{body}</p>
      </div>
    </div>
  );
}
