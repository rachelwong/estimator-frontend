import { CheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { COPIED_FEEDBACK_MS } from '@/constants'

interface ShareLinkProps {
  sessionId: string
}

// Points at /join, the entry for anyone without an identity. The Admin's own
// /start would bounce them there anyway.
export function ShareLink({ sessionId }: ShareLinkProps) {
  const [isCopied, setIsCopied] = useState(false)
  const url = `${window.location.origin}/${sessionId}/join`

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS)
  }

  return (
    <div className="flex flex-1 gap-2">
      <Input
        readOnly
        value={url}
        aria-label="Session link"
        onFocus={(event) => event.target.select()}
      />

      <Button
        type="button"
        variant="secondary"
        size="icon"
        aria-label="Copy link"
        onClick={handleCopy}
      >
        {isCopied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  )
}
