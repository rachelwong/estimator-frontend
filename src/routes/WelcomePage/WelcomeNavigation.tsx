import { REPOSITORY_URL, WelcomeSection } from "@/constants";
import { useEscapeKey } from "@/hooks";
import { cn } from "@/lib/utils";
import { useId, useState } from "react";
import { MenuIcon } from "./MenuIcon";
import { MobileMenu } from "./MobileMenu";
import { StartSessionButton } from "./StartSessionButton";

// Welcome's side of the header (§7 item 1). Desktop links to How to use, the
// repo and the Create form; tablet keeps How to use and the button; a
// phone swaps them all for a Menu button that opens the menu window.
export function WelcomeNavigation() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEscapeKey(isMenuOpen ? () => setMenuOpen(false) : null);

  return (
    <>
      <nav
        aria-label="Main"
        className="hidden items-center gap-7 text-[16px] font-bold tablet:flex"
      >
        <a
          href={`#${WelcomeSection.HOW_TO_USE}`}
          className="hover:text-text-subtle"
        >
          How to use
        </a>
        <a
          href={REPOSITORY_URL.FRONTEND}
          className="hidden hover:text-text-subtle desktop:inline"
          target="_blank"
        >
          GitHub
        </a>
        <StartSessionButton className="text-[12px]" />
      </nav>

      {/* Open, it turns yellow and drops its shadow, reading "Close". */}
      <button
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls={menuId}
        className={cn(
          "inline-flex h-11 cursor-pointer items-center gap-2 border-[3px] border-ink px-3 font-label text-[12px] text-ink outline-none focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ink tablet:hidden",
          isMenuOpen
            ? "bg-selection"
            : "bg-white shadow-[3px_3px_0_var(--color-ink)]",
        )}
        onClick={() => setMenuOpen(!isMenuOpen)}
      >
        {!isMenuOpen && <MenuIcon />}
        {isMenuOpen ? "Close" : "Menu"}
      </button>

      {isMenuOpen && (
        <MobileMenu id={menuId} onClose={() => setMenuOpen(false)} />
      )}
    </>
  );
}
