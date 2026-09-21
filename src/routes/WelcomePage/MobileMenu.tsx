import cardBack from "@/assets/sprites/cardback.svg";
import laptop from "@/assets/sprites/laptop.svg";
import personFour from "@/assets/sprites/p4.svg";
import server from "@/assets/sprites/server.svg";
import { Window } from "@/components/Window";
import { REPOSITORY_URL, WelcomeSection } from "@/constants";
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
        <Window title="menu" bodyClassName="gap-0 px-4 pt-1.5 pb-[18px]">
          <ul>
            <MenuRow
              href={`#${WelcomeSection.HOW_TO_USE}`}
              sprite={cardBack}
              label="How to use"
              onClick={onClose}
            />
            <MenuRow
              href={`#${WelcomeSection.WHY_I_MADE_THIS}`}
              sprite={personFour}
              label="Why I made this"
              onClick={onClose}
            />
            <MenuRow
              href={REPOSITORY_URL.FRONTEND}
              sprite={laptop}
              label="Frontend on GitHub"
              sublabel="estimator-frontend"
              onClick={onClose}
            />
            <MenuRow
              href={REPOSITORY_URL.BACKEND}
              sprite={server}
              label="Backend on GitHub"
              sublabel="estimator-backend"
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
