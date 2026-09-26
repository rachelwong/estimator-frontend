import type { MouseEvent } from "react";
import { PageLayout } from "@/components/PageLayout";
import { SiteFooter } from "@/components/SiteFooter";
import { CallToActionBand } from "./CallToActionBand";
import { DitherBand } from "./DitherBand";
import { HeroSection } from "./HeroSection";
import { HouseRulesSection } from "./HouseRulesSection";
import { HowToUseSection } from "./HowToUseSection";
import { WelcomeNavigation } from "./WelcomeNavigation";
import { WhyIMadeThisSection } from "./WhyIMadeThisSection";

// Home for creators (DESIGN.md §7): what Fold and Flip is, a live Reveal to
// poke at, and a way in. Joiners arrive on /:id/join and never see it.
//
// PLACEHOLDER COPY: every word on this page is provisional until it's supplied
// (DESIGN.md §12), and "Why I made this" is marked as such on the page itself.
// Stage 10 of docs/plans/fold-and-flip.md replaces it.
//
// Default export so router.tsx can lazy() it: the sample Reveal and some twenty
// sprites would otherwise ride in the entry chunk for every Join and Reveal.
export default function WelcomePage() {
  // The logo links to Welcome, which is already open and would move nothing —
  // so here it takes the reader back to the top. Instant under reduced motion (§8).
  function handleLogoLinkClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <PageLayout
      actions={<WelcomeNavigation />}
      footer={<SiteFooter />}
      hasOwnFeedbackButton
      onLogoLinkClick={handleLogoLinkClick}
    >
      <HeroSection />
      <DitherBand />
      <HowToUseSection />
      <WhyIMadeThisSection />
      <HouseRulesSection />
      <CallToActionBand />
    </PageLayout>
  );
}
