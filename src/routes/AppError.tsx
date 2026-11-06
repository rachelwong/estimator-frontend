import { ErrorScreen } from "@/components/ErrorScreen";
import { SiteFooter } from "@/components/SiteFooter";
import { TryAgainButton } from "@/components/TryAgainButton";
import { Button } from "@/components/ui/button";
import { RoutePath } from "@/constants";
import { useContent } from "@/hooks";
import { NetworkError } from "@/lib/api";
import { useEffect } from "react";
import { Link, useRouteError } from "react-router";

// errorElement for every page. An unreachable backend — a cold start, usually —
// reads as a lost connection; anything else is the catch-all.
export function AppError() {
  const error = useRouteError();
  const isUnreachable = error instanceof NetworkError;
  const content = useContent();

  // Once per error, not per render — retrying re-renders this page.
  useEffect(() => {
    console.error("Route failed", error);
  }, [error]);

  return (
    <ErrorScreen
      copy={
        isUnreachable
          ? content.errorScreen.connectionLost
          : content.errorScreen.somethingWentWrong
      }
      footer={<SiteFooter />}
      actions={
        <>
          <TryAgainButton />
          {isUnreachable ? (
            <Button asChild size="lg" variant="secondary">
              <Link to={RoutePath.WELCOME}>{content.action.backToHome}</Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="secondary">
              <Link to={RoutePath.NEW}>{content.action.startSession}</Link>
            </Button>
          )}
        </>
      }
    />
  );
}
