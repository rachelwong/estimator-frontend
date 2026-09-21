import { ErrorScreen } from "@/components/ErrorScreen";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { ERROR_SCREEN_COPY, RoutePath } from "@/constants";
import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <ErrorScreen
      copy={ERROR_SCREEN_COPY.NOT_FOUND}
      footer={<SiteFooter />}
      actions={
        <>
          <Button asChild size="lg">
            <Link to={RoutePath.NEW}>Start a session</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to={RoutePath.WELCOME}>Back to Home</Link>
          </Button>
        </>
      }
    />
  );
}
