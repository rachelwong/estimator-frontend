interface WelcomeSectionHeadingProps {
  text: string;
}

// The h2 at the top of a Welcome page section, on the page's section type scale
// (§3): 27 / 36 / 44, centred at every width.
export function WelcomeSectionHeading({ text }: WelcomeSectionHeadingProps) {
  return (
    <h2 className="text-center font-display text-[27px] leading-[1.05] text-ink tablet:text-[36px] desktop:text-[44px]">
      {text}
    </h2>
  );
}
