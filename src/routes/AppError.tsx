import { ErrorScreen } from "@/components/ErrorScreen";
import { SiteFooter } from "@/components/SiteFooter";
import { TryAgainButton } from "@/components/TryAgainButton";
import { Button } from "@/components/ui/button";
import { ERROR_SCREEN_COPY, RoutePath } from "@/constants";
import { NetworkError } from "@/lib/api";
import { useEffect } from "react";
import { Link, useRouteError } from "react-router";

// errorElement for every page. An unreachable backend — a cold start, usually —
// reads as a lost connection; anything else is the catch-all.
export function AppError() {
  const error = useRouteError();
  const isUnreachable = error instanceof NetworkError;

  // Once per error, not per render — retrying re-renders this page.
  useEffect(() => {
    console.error("Route failed", error);
  }, [error]);

  return (
    <ErrorScreen
      copy={
        isUnreachable
          ? ERROR_SCREEN_COPY.CONNECTION_LOST
          : ERROR_SCREEN_COPY.SOMETHING_WENT_WRONG
      }
      footer={<SiteFooter />}
      actions={
        <>
          <TryAgainButton />
          {isUnreachable ? (
            <Button asChild size="lg" variant="secondary">
              <Link to={RoutePath.WELCOME}>Back to Home</Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="secondary">
              <Link to={RoutePath.NEW}>Start a session</Link>
            </Button>
          )}
        </>
      }
    />
  );
}
