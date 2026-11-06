import { ErrorScreen } from "@/components/ErrorScreen";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { RoutePath } from "@/constants";
import { useContent } from "@/hooks";
import { Link } from "react-router";

export function NotFoundPage() {
  const content = useContent();

  return (
    <ErrorScreen
      copy={content.errorScreen.notFound}
      footer={<SiteFooter />}
      actions={
        <>
          <Button asChild size="lg">
            <Link to={RoutePath.NEW}>{content.action.startSession}</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link to={RoutePath.WELCOME}>{content.action.backToHome}</Link>
          </Button>
        </>
      }
    />
  );
}
