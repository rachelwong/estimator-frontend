import { Badge } from '@/components/ui/badge'

interface SessionStatusHeaderProps {
  label: string
}

// e.g. "In Progress", "Ended".
export function SessionStatusHeader({ label }: SessionStatusHeaderProps) {
  return (
    <div className="flex justify-center">
      <Badge variant="secondary">{label}</Badge>
    </div>
  )
}
