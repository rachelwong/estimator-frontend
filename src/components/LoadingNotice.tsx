import { useEffect, useState } from "react";

// Below this, the wait is a warm server and needs no explanation. Showing
// the notice anyway flashes it for a frame on every navigation.
const SHOW_AFTER_MS = 400;

// Shown while a loader or action waits on the backend. A sleeping Render
// instance takes 30–60s to wake, so the wait is explained, not just spun.
export function LoadingNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-6 mx-auto w-fit rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground shadow-sm"
    >
      Loading…
    </div>
  );
}
