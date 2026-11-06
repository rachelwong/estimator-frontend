interface WelcomeSectionHeadingProps {
  text: string;
}

// The h2 at the top of a Welcome page section, on the page's section type scale
// (§3): 27 / 36 / 44, centred at every width.
export function WelcomeSectionHeading({ text }: WelcomeSectionHeadingProps) {
  return (
    // Work sets every section heading left, under a short accent rule (NL-Welcome-*).
    <div className="flex flex-col gap-4">
      <span aria-hidden="true" className="hidden h-[3px] w-8 rounded-[2px] bg-ring work:block" />
      <h2 className="text-center font-display text-[27px] leading-[1.05] text-foreground tablet:text-[36px] desktop:text-[44px] work:text-left work:text-[28px] work:leading-[1.15] work:font-medium work:tracking-[-0.01em] work:tablet:text-[32px] work:desktop:text-[36px]">
        {text}
      </h2>
    </div>
  );
}
