import close from "@/assets/sprites/close.svg";
import menu from "@/assets/sprites/menu.svg";
import { FeedbackButton } from "@/components/FeedbackButton";
import { Sprite } from "@/components/Sprite";
import { WelcomeSection } from "@/constants";
import { useContent, useEscapeKey } from "@/hooks";
import { cn } from "@/lib/utils";
import { useId, useState } from "react";
import { MobileMenu } from "./MobileMenu";
import { StartSessionButton } from "./StartSessionButton";

// Welcome's side of the header (§7 item 1). Desktop links to How to use, the
// repo, Feedback and the Create form; tablet keeps How to use, Feedback and the
// button; a phone swaps them all for a hamburger button that opens the menu window.
//
// The Feedback tile is placed here rather than left to PageLayout because it
// belongs next to Start a session — and being inside this nav is also what
// hides it on a phone, where the menu carries its own Feedback row instead.
export function WelcomeNavigation() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const navigation = useContent().welcome.navigation;

  useEscapeKey(isMenuOpen ? () => setMenuOpen(false) : null);

  return (
    <>
      <nav
        aria-label={navigation.mainLabel}
        className="hidden items-center gap-7 text-[16px] font-bold tablet:flex work:gap-6 work:text-[15px] work:font-medium work:text-nav-foreground work:desktop:gap-7"
      >
        <a
          href={`#${WelcomeSection.HOW_TO_USE}`}
          className="hover:text-nav-hover"
        >
          {navigation.howToUse}
        </a>
        <a
          href={`#${WelcomeSection.WHY_I_MADE_THIS}`}
          className="hidden hover:text-nav-hover desktop:inline"
        >
          {navigation.gitHub}
        </a>
        <FeedbackButton />
        <StartSessionButton className="text-[12px] work:h-9 work:px-4 work:text-[14px] work:font-semibold" />
      </nav>

      {/* Icon only. Open, it turns yellow, drops its shadow and shows a cross. */}
      <button
        type="button"
        aria-label={isMenuOpen ? navigation.closeMenu : navigation.openMenu}
        aria-expanded={isMenuOpen}
        aria-controls={menuId}
        className={cn(
          "inline-flex size-11 cursor-pointer items-center justify-center rounded-control border-[3px] border-ghost-border outline-none focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ring tablet:hidden work:border work:focus-visible:outline-2 work:focus-visible:outline-offset-2",
          isMenuOpen
            ? "bg-action"
            : "bg-secondary shadow-icon",
        )}
        onClick={() => setMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <Sprite source={close} className="w-[15px]" />
        ) : (
          <Sprite source={menu} className="w-[18px]" />
        )}
      </button>

      {isMenuOpen && (
        <MobileMenu id={menuId} onClose={() => setMenuOpen(false)} />
      )}
    </>
  );
}
