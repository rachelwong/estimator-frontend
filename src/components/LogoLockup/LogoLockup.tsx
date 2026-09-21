import { cn } from '@/lib/utils'
import { LogoMark } from './LogoMark'

interface LogoLockupProps {
  className?: string
}

// Mark + wordmark, 10-12px apart, the name in Bungee (DESIGN.md §1). The mark
// carries the whole brand on its own, so the gap and the type size are the only
// things this adds.
//
// The mark's width drives its own number size — the card back is a size
// container — so scaling the lockup is one class on the mark.
export function LogoLockup({ className }: LogoLockupProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <LogoMark className="h-10 w-[30px] tablet:h-12 tablet:w-9" />

      <span className="font-display text-[20px] leading-none text-ink tablet:text-[24px]">
        Fold and Flip
      </span>
    </span>
  )
}
