import { REPOSITORY_URL, WELCOME_GUTTER_CLASS } from '@/constants'
import { cn } from '@/lib/utils'

// Welcome's footer (§7 item 10). The artboard also links "Privacy", but there is
// no privacy page to send anyone to, so it waits until one exists.
export function WelcomeFooter() {
  return (
    <footer
      className={cn(
        'mt-16 flex flex-col gap-3 border-t-[3px] border-ink bg-white py-7 font-label text-[12px] tablet:mt-24 tablet:flex-row tablet:justify-between',
        WELCOME_GUTTER_CLASS,
      )}
    >
      <span>Fold and Flip · a side project</span>
      <a href={REPOSITORY_URL.FRONTEND} className="underline hover:text-text-subtle">
        GitHub
      </a>
    </footer>
  )
}
