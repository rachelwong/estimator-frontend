interface AxisValueProps {
  value: number
}

export function AxisValue({ value }: AxisValueProps) {
  return (
    <span className="flex items-center justify-center px-1 text-xs text-muted-foreground tabular-nums">
      {value}
    </span>
  )
}
