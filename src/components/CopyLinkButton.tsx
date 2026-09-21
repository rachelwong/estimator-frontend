import { useState } from 'react'
import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { COPIED_FEEDBACK_MS } from '@/constants'
import { cn } from '@/lib/utils'

interface CopyLinkButtonProps {
  url: string
  /** Yellow in the share bar, white on the ready screen (§7). */
  variant?: ComponentProps<typeof Button>['variant']
  className?: string
}

// "Copy link", which fills `copied` and reads "Copied!" for 1.6s once the link
// is on the clipboard (DESIGN.md §7).
export function CopyLinkButton({ url, variant, className }: CopyLinkButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS)
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={cn('min-w-[112px]', isCopied && 'bg-copied', className)}
      onClick={handleCopy}
    >
      {isCopied ? 'Copied!' : 'Copy link'}
    </Button>
  )
}
