import { REPOSITORY_URL } from "@/constants";
import { useContent } from "@/hooks";

// The footer on every screen outside a session (§7 item 9): Welcome, not found
// and the app's error screen. Create, Join, Active and Ended go without — the
// session is the whole page there. The artboard also links "Privacy", but there
// is no privacy page to send anyone to, so it waits until one exists.
export function SiteFooter() {
  const content = useContent();

  return (
    <footer
      className="mt-16 flex flex-col gap-3 border-t-[3px] border-header-border bg-header px-5 py-7 font-label text-[12px] tablet:mt-24 tablet:flex-row tablet:justify-between tablet:px-10 desktop:px-20 work:mt-0 work:gap-2 work:border-t work:border-border-subtle work:py-5 work:text-[14px] work:leading-5 work:text-subtle-foreground work:tablet:mt-0 work:tablet:h-16 work:tablet:items-center work:tablet:py-0 work:desktop:px-[120px]"
    >
      <span>{content.footer.stack}</span>
      <a href={REPOSITORY_URL.PORTFOLIO} className="hover:text-nav-hover work:underline work:underline-offset-2">
        {content.footer.copyright(new Date().getFullYear())}
      </a>
    </footer>
  );
}
