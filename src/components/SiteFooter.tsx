import { REPOSITORY_URL, WELCOME_GUTTER_CLASS } from "@/constants";
import { cn } from "@/lib/utils";

// The footer on every screen outside a session (§7 item 9): Welcome, not found
// and the app's error screen. Create, Join, Active and Ended go without — the
// session is the whole page there. The artboard also links "Privacy", but there
// is no privacy page to send anyone to, so it waits until one exists.
export function SiteFooter() {
  return (
    <footer
      className={cn(
        "mt-16 flex flex-col gap-3 border-t-[3px] border-ink bg-white py-7 font-label text-[12px] tablet:mt-24 tablet:flex-row tablet:justify-between",
        WELCOME_GUTTER_CLASS,
      )}
    >
      <span>React · Typescript · Node.js · Socket.io · TailwindCSS</span>
      <a href={REPOSITORY_URL.PORTFOLIO} className="hover:text-text-subtle">
        &#169; {new Date().getFullYear()} Rachel Wong
      </a>
    </footer>
  );
}
