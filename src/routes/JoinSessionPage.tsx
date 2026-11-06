import cardBack from "@/assets/sprites/cardback.svg";
import { PageLayout } from "@/components/PageLayout";
import { PixelProgressBar } from "@/components/PixelProgressBar";
import { SessionDescription } from "@/components/SessionDescription";
import { Sprite } from "@/components/Sprite";
import { SpriteScatter } from "@/components/SpriteScatter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Window } from "@/components/Window";
import { PixelBarSize, WindowVariant } from "@/constants";
import { useContent } from "@/hooks";
import { cn } from "@/lib/utils";
import { isNameValid } from "@/lib/validation";
import type { ActionErrorData, JoinLoaderData } from "@/types";
import { actionErrorMessage } from "@/utils";
import { useState } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";

// The Join screen (DESIGN.md §7). A heading, the Session's description when it
// has one, one labelled input, the button and the privacy note — nothing else.
// The field reads as Create's does.
export function JoinSessionPage() {
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);

  const { description } = useLoaderData() as JoinLoaderData;
  const navigation = useNavigation();
  const actionData = useActionData() as ActionErrorData | undefined;
  const content = useContent();

  // Checked here so "Jim@Bob" never reaches the wire. The server's
  // INVALID_NAME stays the backstop.
  const isNameOk = isNameValid(name);
  const isSubmitting = navigation.state !== "idle";

  return (
    <PageLayout>
      <div className="relative isolate flex justify-center px-3 pt-8 pb-16 tablet:px-10 tablet:pt-10">
        <SpriteScatter />

        <Window title={content.join.windowTitle} variant={WindowVariant.JOIN} chip={content.role.participant}>
          <h1 className="font-display text-[22px] leading-[1.05] text-foreground tablet:text-[30px]">
            {content.join.heading}
          </h1>

          <SessionDescription description={description} />

          <Form method="post" className="flex flex-col gap-5 tablet:gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-[15px] font-extrabold">
                {content.nameField.label}
              </label>
              <Input
                id="name"
                name="name"
                value={name}
                placeholder={content.nameField.placeholder}
                autoComplete="off"
                onChange={(event) => setName(event.target.value)}
                onBlur={() => setTouched(true)}
                aria-invalid={touched && !isNameOk}
              />
              {touched && !isNameOk && (
                <p className="text-[14px] text-error-foreground">{content.validation.nameRule}</p>
              )}
            </div>

            {actionData && (
              <p className="text-[14px] text-error-foreground">
                {actionErrorMessage(actionData, content.actionFailure)}
              </p>
            )}

            {/* Pressed, it carries the inline loader (§7) — held at full
                strength rather than dimmed like a button that can't be used. */}
            <Button
              type="submit"
              size="lg"
              className={cn("w-full", isSubmitting && "disabled:opacity-100")}
              disabled={isSubmitting || !isNameOk}
            >
              {isSubmitting && <PixelProgressBar size={PixelBarSize.INLINE} />}
              {isSubmitting ? content.join.submitting : content.join.submit}
            </Button>
          </Form>

          <div className="flex items-start gap-3 border-2 border-border-subtle bg-note px-4 py-3.5">
            <Sprite
              source={cardBack}
              className="sprite-sticker h-[29px] w-6 shrink-0"
            />
            <p className="text-[14px] leading-normal">{content.join.privacyNote}</p>
          </div>
        </Window>
      </div>
    </PageLayout>
  );
}
