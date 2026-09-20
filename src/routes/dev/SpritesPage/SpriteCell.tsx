import { Sprite } from '@/components/Sprite'

interface SpriteCellProps {
  source: string
  url: string
}

// DEV ONLY. One sprite with the file it came from, so a drawing on the sheet
// traces straight back to the SVG.
export function SpriteCell({ source, url }: SpriteCellProps) {
  return (
    <div className="grid justify-items-center gap-2 border-2 border-ink bg-white p-3">
      <div className="grid h-24 place-items-center">
        <Sprite source={url} className="max-h-24 w-auto" />
      </div>

      <p className="text-center font-body text-[11px] break-all text-text-subtle">{source}</p>
    </div>
  )
}
