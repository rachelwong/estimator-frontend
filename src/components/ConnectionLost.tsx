import { ErrorScreen } from "@/components/ErrorScreen";
import { TryAgainButton } from "@/components/TryAgainButton";
import { Button } from "@/components/ui/button";
import { ERROR_SCREEN_COPY, RoutePath } from "@/constants";
import { Link } from "react-router";

// A dropped Admin — a Participant goes back to /join instead. Retrying is left
// to a press: reconnecting on its own would loop against a backend that is down.
export function ConnectionLost() {
  return (
    <ErrorScreen
      copy={ERROR_SCREEN_COPY.CONNECTION_LOST}
      actions={
        <>
          <TryAgainButton />
          <Button asChild size="lg" variant="secondary">
            <Link to={RoutePath.WELCOME}>Back to Home</Link>
          </Button>
        </>
      }
    />
  );
}
