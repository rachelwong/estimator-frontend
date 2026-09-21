import { useContext } from 'react'
import { HeaderSlotContext } from '@/lib/headerSlot'

// Where a page portals its header controls. Null until the header mounts —
// render nothing into it until then.
export function useHeaderSlot(): HTMLElement | null {
  return useContext(HeaderSlotContext)
}
