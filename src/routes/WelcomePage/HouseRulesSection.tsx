import avatarFour from "@/assets/sprites/avatar.svg";
import ruleAxes from "@/assets/sprites/rule-axes.svg";
import ruleChange from "@/assets/sprites/rule-change.svg";
import ruleKept from "@/assets/sprites/rule-kept.svg";
import ruleLink from "@/assets/sprites/rule-link.svg";
import ruleLive from "@/assets/sprites/rule-live.svg";
import { useContent } from "@/hooks";
import { HouseRule } from "./HouseRule";
import { WelcomeSectionHeading } from "./WelcomeSectionHeading";

// House rules (§7 item 7): six things worth knowing before a first Session.
// Three across on desktop, two on tablet, one on a phone.
export function HouseRulesSection() {
  const rules = useContent().welcome.houseRules;

  return (
    <section
      className="flex flex-col gap-6 px-5 pt-20 tablet:gap-9 tablet:px-10 tablet:pt-[110px] desktop:px-20"
    >
      <WelcomeSectionHeading text={rules.heading} />

      <ul className="grid gap-4 tablet:grid-cols-2 tablet:gap-6 desktop:grid-cols-3">
        <HouseRule sprite={ruleLive} title={rules.livePrivate.title} description={rules.livePrivate.description} />
        <HouseRule sprite={avatarFour} title={rules.noSignUp.title} description={rules.noSignUp.description} />
        <HouseRule sprite={ruleLink} title={rules.uniqueLink.title} description={rules.uniqueLink.description} />
        <HouseRule
          sprite={ruleChange}
          title={rules.changeYourMind.title}
          description={rules.changeYourMind.description}
        />
        <HouseRule sprite={ruleAxes} title={rules.twoAxes.title} description={rules.twoAxes.description} />
        <HouseRule sprite={ruleKept} title={rules.nothingKept.title} description={rules.nothingKept.description} />
      </ul>
    </section>
  );
}
