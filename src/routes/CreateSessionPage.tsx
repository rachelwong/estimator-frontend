import { PageLayout } from "@/components/PageLayout";
import { PixelProgressBar } from "@/components/PixelProgressBar";
import { PointSystemPicker } from "@/components/PointSystemPicker";
import { RangeSlider } from "@/components/RangeSlider";
import { SpriteScatter } from "@/components/SpriteScatter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Window } from "@/components/Window";
import { PixelBarSize, PointSystemType, WindowVariant } from "@/constants";
import { useContent } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  isDescriptionValid,
  isNameValid,
  MAX_DESCRIPTION_LENGTH,
  normalizeDescription,
} from "@/lib/validation";
import type {
  ActionErrorData,
  PointSystemType as PointSystemTypeValue,
} from "@/types";
import { actionErrorMessage } from "@/utils";
import { useState } from "react";
import { Form, useActionData, useNavigation } from "react-router";

// The Create screen (DESIGN.md §7): window "new-session", Name, an
// optional ticket or task, the point system, the highest axis value, and
// Create session. No grid preview.
// Default export so router.tsx can lazy() it directly.
export default function CreateSessionPage() {
  const [adminName, setAdminName] = useState("");
  const [touched, setTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [pointSystemType, setPointSystemType] = useState<PointSystemTypeValue>(
    PointSystemType.NUMERICAL,
  );
  const [sliderMax, setSliderMax] = useState(0);

  const navigation = useNavigation();
  const actionData = useActionData() as ActionErrorData | undefined;
  const content = useContent();

  const isNameOk = isNameValid(adminName);
  // Counted after the same clean-up the server does, so the two agree.
  const descriptionLength = normalizeDescription(description).length;
  const isDescriptionOk = isDescriptionValid(description);
  const isSubmitting = navigation.state === "submitting";

  // A max of 0 is the slider's starting point, and a grid of one Square is no
  // grid at all — so the form waits for both answers before it will go.
  const canSubmit = isNameOk && isDescriptionOk && sliderMax > 0;

  // Switching point system clears the max, so the admin consciously re-picks
  // instead of inheriting a full-size grid from the previous choice.
  function handlePointSystemChange(next: PointSystemTypeValue) {
    setPointSystemType(next);
    setSliderMax(0);
  }

  return (
    <PageLayout>
      <div className="relative isolate flex justify-center px-3 pt-8 pb-16 tablet:px-10 tablet:pt-10">
        <SpriteScatter />

        <Window title={content.create.windowTitle} variant={WindowVariant.CREATE} chip={content.role.admin}>
          <div className="flex flex-col gap-1.5">
            <h1 className="font-display text-[20px] leading-[1.05] text-ink tablet:text-[28px]">
              {content.create.heading}
            </h1>
            <p className="text-[14px] leading-[1.45] text-text-muted">
              {content.create.intro}
            </p>
          </div>

          <Form method="post" className="flex flex-col gap-5 tablet:gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="adminName" className="text-[15px] font-extrabold">
                {content.nameField.label}
              </label>
              <Input
                id="adminName"
                name="adminName"
                value={adminName}
                placeholder={content.nameField.placeholder}
                autoComplete="off"
                onChange={(event) => setAdminName(event.target.value)}
                onBlur={() => setTouched(true)}
                aria-invalid={touched && !isNameOk}
              />
              {touched && !isNameOk && (
                <p className="text-[14px] text-abstained">{content.validation.nameRule}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-3">
                <label
                  htmlFor="description"
                  className="text-[15px] font-extrabold"
                >
                  {content.create.descriptionLabel}
                </label>
                <span
                  id="description-count"
                  className="font-label text-[12px] text-text-subtle"
                >
                  {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
                </span>
              </div>
              <Input
                id="description"
                name="description"
                value={description}
                placeholder={content.create.descriptionPlaceholder}
                autoComplete="off"
                onChange={(event) => setDescription(event.target.value)}
                aria-describedby="description-count"
                aria-invalid={!isDescriptionOk}
              />
              {!isDescriptionOk && (
                <p className="text-[14px] text-abstained">
                  {content.validation.descriptionRule(MAX_DESCRIPTION_LENGTH)}
                </p>
              )}
            </div>

            <PointSystemPicker
              value={pointSystemType}
              onChange={handlePointSystemChange}
            />

            <RangeSlider
              pointSystemType={pointSystemType}
              value={sliderMax}
              onChange={setSliderMax}
            />

            {actionData && (
              <p className="text-[14px] text-abstained">
                {actionErrorMessage(actionData, content.actionFailure)}
              </p>
            )}

            {/* Pressed, it carries the inline loader (§7) — held at full
                strength rather than dimmed like a button that can't be used. */}
            <Button
              type="submit"
              size="lg"
              className={cn("w-full", isSubmitting && "disabled:opacity-100")}
              disabled={isSubmitting || !canSubmit}
            >
              {isSubmitting && <PixelProgressBar size={PixelBarSize.INLINE} />}
              {isSubmitting ? content.create.submitting : content.create.submit}
            </Button>
          </Form>
        </Window>
      </div>
    </PageLayout>
  );
}
