import avatarFour from "@/assets/sprites/avatar.svg";
import ruleAxes from "@/assets/sprites/rule-axes.svg";
import ruleChange from "@/assets/sprites/rule-change.svg";
import ruleKept from "@/assets/sprites/rule-kept.svg";
import ruleLink from "@/assets/sprites/rule-link.svg";
import ruleLive from "@/assets/sprites/rule-live.svg";
import workRuleAxes from "@/assets/sprites/work/rule-axes.svg";
import workRuleChange from "@/assets/sprites/work/rule-change.svg";
import workRuleKept from "@/assets/sprites/work/rule-kept.svg";
import workRuleLink from "@/assets/sprites/work/rule-link.svg";
import workRuleLive from "@/assets/sprites/work/rule-live.svg";
import workRuleSignUp from "@/assets/sprites/work/rule-sign-up.svg";
import { Theme } from "@/constants";
import { useContent, useTheme } from "@/hooks";
import { HouseRule } from "./HouseRule";
import { WelcomeSectionHeading } from "./WelcomeSectionHeading";

// House rules (§7 item 7): six things worth knowing before a first Session.
// Three across on desktop, two on tablet, one on a phone.
//
// Work swaps each pixel sprite for its line illustration (NL-Welcome-*), held
// still on the frame that tells the rule without motion.
export function HouseRulesSection() {
  const rules = useContent().welcome.houseRules;
  const isWorkTheme = useTheme().theme === Theme.WORK;

  return (
    <section
      className="flex flex-col gap-6 px-5 pt-20 tablet:gap-9 tablet:px-10 tablet:pt-[110px] desktop:px-20 work:mx-auto work:w-full work:max-w-[1440px] work:px-5 work:tablet:px-10 work:desktop:px-[120px] work:pt-[72px] work:tablet:gap-8 work:tablet:pt-[88px] work:desktop:pt-28"
    >
      <WelcomeSectionHeading text={rules.heading} />

      <ul className="grid gap-4 tablet:grid-cols-2 tablet:gap-6 desktop:grid-cols-3 work:mb-16 work:tablet:mb-[88px] work:desktop:mb-28">
        <HouseRule sprite={isWorkTheme ? workRuleLive : ruleLive} title={rules.livePrivate.title} description={rules.livePrivate.description} />
        <HouseRule sprite={isWorkTheme ? workRuleSignUp : avatarFour} title={rules.noSignUp.title} description={rules.noSignUp.description} />
        <HouseRule sprite={isWorkTheme ? workRuleLink : ruleLink} title={rules.uniqueLink.title} description={rules.uniqueLink.description} />
        <HouseRule
          sprite={isWorkTheme ? workRuleChange : ruleChange}
          title={rules.changeYourMind.title}
          description={rules.changeYourMind.description}
        />
        <HouseRule sprite={isWorkTheme ? workRuleAxes : ruleAxes} title={rules.twoAxes.title} description={rules.twoAxes.description} />
        <HouseRule sprite={isWorkTheme ? workRuleKept : ruleKept} title={rules.nothingKept.title} description={rules.nothingKept.description} />
      </ul>
    </section>
  );
}
