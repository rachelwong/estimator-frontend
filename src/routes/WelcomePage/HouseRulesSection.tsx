import avatarFour from "@/assets/sprites/avatar.svg";
import ruleAxes from "@/assets/sprites/rule-axes.svg";
import ruleChange from "@/assets/sprites/rule-change.svg";
import ruleKept from "@/assets/sprites/rule-kept.svg";
import ruleLink from "@/assets/sprites/rule-link.svg";
import ruleLive from "@/assets/sprites/rule-live.svg";
import {
  WELCOME_GUTTER_CLASS,
  WELCOME_SECTION_HEADING_CLASS,
} from "@/constants";
import { cn } from "@/lib/utils";
import { HouseRule } from "./HouseRule";

// House rules (§7 item 7): six things worth knowing before a first Session.
// Three across on desktop, two on tablet, one on a phone.
export function HouseRulesSection() {
  return (
    <section
      className={cn(
        "flex flex-col gap-6 pt-20 tablet:gap-9 tablet:pt-[110px]",
        WELCOME_GUTTER_CLASS,
      )}
    >
      <h2 className={cn(WELCOME_SECTION_HEADING_CLASS, "text-center")}>
        House rules
      </h2>

      <ul className="grid gap-4 tablet:grid-cols-2 tablet:gap-6 desktop:grid-cols-3">
        <HouseRule
          sprite={ruleLive}
          title="Live, but private"
          description="The session updates in real time, but nobody sees any Votes until the Reveal."
        />
        <HouseRule
          sprite={avatarFour}
          title="No sign-up"
          description="Open the link and type in a name. That’s all you need."
        />
        <HouseRule
          sprite={ruleLink}
          title="Unique link"
          description="Every new session gets its own link. Share it with your team."
        />
        <HouseRule
          sprite={ruleChange}
          title="Change your mind"
          description="When the session is active, you can change your Vote on the Grid. Click on the same one to clear your selection."
        />
        <HouseRule
          sprite={ruleAxes}
          title="Two axes, one grid"
          description="Time and Resources are relative. Resources can mean effort, unknowns & complexities."
        />
        <HouseRule
          sprite={ruleKept}
          title="Nothing is kept"
          description="Sessions only live in memory. No accounts, no history. We don't ask for or store anything about you."
        />
      </ul>
    </section>
  );
}
