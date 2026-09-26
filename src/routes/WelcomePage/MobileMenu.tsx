import avatarFour from "@/assets/sprites/avatar4.svg";
import bug from "@/assets/sprites/bug.svg";
import cardBack from "@/assets/sprites/cardback.svg";
import laptop from "@/assets/sprites/laptop.svg";
import { Window } from "@/components/Window";
import { REPOSITORY_URL, WelcomeSection, WindowVariant } from "@/constants";
import { MenuRow } from "./MenuRow";
import { StartSessionButton } from "./StartSessionButton";

interface MobileMenuProps {
  id: string;
  onClose: () => void;
}

// The phone's menu (§7 "Mobile menu"): an ink 45% backdrop over the page below
// the header, and a window titled "menu" dropped in 12px from the edges. Tapping
// the backdrop, a row, Esc or the Close button shuts it.
//
// Fixed, so it stays put over a page that scrolls beneath it, and capped to the
// screen so a short phone can still reach Start a session. From tablet up the
// header has room for its links and the whole thing is hidden.
export function MobileMenu({ id, onClose }: MobileMenuProps) {
  return (
    <div className="tablet:hidden">
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-16 bottom-0 bg-ink/45"
        onClick={onClose}
      />

      <nav
        id={id}
        aria-label="Menu"
        className="fixed inset-x-3 top-[76px] max-h-[calc(100dvh-88px)] overflow-y-auto"
      >
        <Window title="menu" variant={WindowVariant.MENU}>
          <ul>
            <MenuRow
              href={`#${WelcomeSection.HOW_TO_USE}`}
              sprite={cardBack}
              label="How to use"
              onClick={onClose}
            />
            <MenuRow
              href={`#${WelcomeSection.WHY_I_MADE_THIS}`}
              sprite={avatarFour}
              label="Why I made this"
              onClick={onClose}
            />
            <MenuRow
              href={`#${WelcomeSection.WHY_I_MADE_THIS}`}
              sprite={laptop}
              label="GitHub"
              sublabel="Frontend & backend repositories"
              onClick={onClose}
            />
            {/* The header's Feedback tile has no room beside the Menu button on
                a phone, so on Welcome it moves in here (§7 "Mobile menu"). */}
            <MenuRow
              href={REPOSITORY_URL.LINKEDIN}
              sprite={bug}
              label="Feedback"
              opensInNewTab
              onClick={onClose}
            />
          </ul>

          <div className="pt-[18px]">
            <StartSessionButton className="h-[52px] w-full text-[14px]" />
          </div>
        </Window>
      </nav>
    </div>
  );
}
