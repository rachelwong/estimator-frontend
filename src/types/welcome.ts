// One thing a character in the closing band says. `id` goes up with every
// remark so a new one replaces the last from the start of its slide, even
// mid-flight; `jitter` (0–1) is where it sits across the gap it slides up in;
// `tilt` (-1–1) is how far it leans, and which way.
export interface CrowdRemark {
  id: number
  line: string
  jitter: number
  tilt: number
}
