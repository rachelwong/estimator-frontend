import { cn } from "@/lib/utils";
import parse from "html-react-parser";

interface MakerNoteProps {
  /** The Silkscreen label over the accent rule: "the problem", "the idea", "the build". */
  label: string;
  text: string;
  /** Where this column sits in the spread — its padding and ink rules. */
  className?: string;
}

// One column of the Why I made this spread (§7 item 6): a Silkscreen label on an
// accent rule, and a paragraph under it.
export function MakerNote({ label, text, className }: MakerNoteProps) {
  return (
    <div className={cn("flex flex-col gap-3.5", className)}>
      <div className="pb-1">
        <span className="font-label text-[13px]">{label}</span>
      </div>

      <div className="text-[18px] leading-[1.6] text-text-muted tablet:text-[18px] text-text-muted">
        {parse(text)}
      </div>
    </div>
  );
}
