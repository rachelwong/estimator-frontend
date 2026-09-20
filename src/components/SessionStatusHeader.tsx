import { Chip } from '@/components/Chip'

interface SessionStatusHeaderProps {
  label: string
}

// e.g. "In Progress", "Ended".
export function SessionStatusHeader({ label }: SessionStatusHeaderProps) {
  return (
    <div className="flex justify-center">
      <Chip>{label}</Chip>
    </div>
  )
}
