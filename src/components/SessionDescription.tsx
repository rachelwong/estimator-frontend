import { URL_PATTERN } from "@/lib/patterns";

interface SessionDescriptionProps {
  description: string | null;
}

// The ticket or task being estimated, under the heading on Join, Active and the
// Reveal. Nothing at all when the admin gave none. Split on URLs — text at the
// even indexes, links at the odd — and rendered as elements, never as HTML, so
// the admin's text can't run.
export function SessionDescription({ description }: SessionDescriptionProps) {
  if (description === null) {
    return null;
  }

  return (
    <p
      data-description
      className="font-body text-center font-medium text-[15px] leading-[1.45] break-words text-ink tablet:text-[16px]"
    >
      {description.split(URL_PATTERN).map((piece, index) =>
        index % 2 === 1 ? (
          <a
            key={index}
            href={piece}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold link text-accent underline underline-offset-2 outline-none focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {piece}
          </a>
        ) : (
          <span key={index}>{piece}</span>
        ),
      )}
    </p>
  );
}
