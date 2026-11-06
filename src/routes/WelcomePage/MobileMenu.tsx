import avatarFour from "@/assets/sprites/avatar4.svg";
import bug from "@/assets/sprites/bug.svg";
import cardBack from "@/assets/sprites/cardback.svg";
import laptop from "@/assets/sprites/laptop.svg";
import { Window } from "@/components/Window";
import { REPOSITORY_URL, WelcomeSection, WindowVariant } from "@/constants";
import { useContent } from "@/hooks";
import { MenuRow } from "./MenuRow";
import { StartSessionButton } from "./StartSessionButton";

interface MobileMenuProps {
  id: string;
  onClose: () => void;
}

// The phone's menu (§7 "Mobile menu"): an ink 45% backdrop over the page below
// the header, and a window titled "menu" dropped in 12px from the edges. Tapping
// the backdrop, a row, Esc or the close button shuts it.
//
// Fixed, so it stays put over a page that scrolls beneath it, and capped to the
// screen so a short phone can still reach Start a session. From tablet up the
// header has room for its links and the whole thing is hidden.
//
// The wrapper is `contents` because it renders inside the header's flex row:
// as a box it would be an empty flex item, and the row's gap after the toggle
// would push the Close button left of where the Menu button sat.
export function MobileMenu({ id, onClose }: MobileMenuProps) {
  const content = useContent();
  const navigation = content.welcome.navigation;

  return (
    <div className="contents tablet:hidden">
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-16 bottom-0 bg-scrim work:top-14"
        onClick={onClose}
      />

      <nav
        id={id}
        aria-label={navigation.menuLabel}
        className="fixed inset-x-3 top-[76px] max-h-[calc(100dvh-88px)] overflow-y-auto work:top-[68px] work:max-h-[calc(100dvh-80px)] work:rounded-card work:shadow-menu"
      >
        <Window title={navigation.menuWindowTitle} variant={WindowVariant.MENU}>
          <ul>
            <MenuRow
              href={`#${WelcomeSection.HOW_TO_USE}`}
              sprite={cardBack}
              label={navigation.howToUse}
              onClick={onClose}
            />
            <MenuRow
              href={`#${WelcomeSection.WHY_I_MADE_THIS}`}
              sprite={avatarFour}
              label={navigation.whyIMadeThis}
              onClick={onClose}
            />
            <MenuRow
              href={`#${WelcomeSection.WHY_I_MADE_THIS}`}
              sprite={laptop}
              label={navigation.gitHub}
              sublabel={navigation.gitHubSublabel}
              onClick={onClose}
            />
            {/* The header's Feedback tile has no room beside the Menu button on
                a phone, so on Welcome it moves in here (§7 "Mobile menu"). */}
            <MenuRow
              href={REPOSITORY_URL.LINKEDIN}
              sprite={bug}
              label={content.feedback.label}
              opensInNewTab
              onClick={onClose}
            />
          </ul>

          <div className="pt-[18px]">
            <StartSessionButton className="h-[52px] w-full text-[14px] work:h-12 work:text-[16px] work:font-semibold" />
          </div>
        </Window>
      </nav>
    </div>
  );
}
