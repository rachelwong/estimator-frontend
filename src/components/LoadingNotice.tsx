import { useEffect, useState } from "react";
import { LOADING_NOTICE_DELAY_MS } from "@/constants";

// Shown while a loader or action waits on the backend. A sleeping Render
// instance takes 30–60s to wake, so the wait is explained, not just spun.
export function LoadingNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), LOADING_NOTICE_DELAY_MS);
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
