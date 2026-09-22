import { REPOSITORY_URL } from "@/constants";

// The footer on every screen outside a session (§7 item 9): Welcome, not found
// and the app's error screen. Create, Join, Active and Ended go without — the
// session is the whole page there. The artboard also links "Privacy", but there
// is no privacy page to send anyone to, so it waits until one exists.
export function SiteFooter() {
  return (
    <footer
      className="mt-16 flex flex-col gap-3 border-t-[3px] border-ink bg-white px-5 py-7 font-label text-[12px] tablet:mt-24 tablet:flex-row tablet:justify-between tablet:px-10 desktop:px-20"
    >
      <span>React · Typescript · Node.js · Socket.io · TailwindCSS</span>
      <a href={REPOSITORY_URL.PORTFOLIO} className="hover:text-text-subtle">
        &#169; {new Date().getFullYear()} Rachel Wong
      </a>
    </footer>
  );
}
