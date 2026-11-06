import { ErrorScreen } from "@/components/ErrorScreen";
import { TryAgainButton } from "@/components/TryAgainButton";
import { Button } from "@/components/ui/button";
import { RoutePath } from "@/constants";
import { useContent } from "@/hooks";
import { Link } from "react-router";

// A dropped Admin — a Participant goes back to /join instead. Retrying is left
// to a press: reconnecting on its own would loop against a backend that is down.
export function ConnectionLost() {
  const content = useContent();

  return (
    <ErrorScreen
      copy={content.errorScreen.connectionLost}
      actions={
        <>
          <TryAgainButton />
          <Button asChild size="lg" variant="ghost">
            <Link to={RoutePath.WELCOME}>{content.action.backToHome}</Link>
          </Button>
        </>
      }
    />
  );
}
