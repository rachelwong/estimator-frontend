import person from "@/assets/sprites/work/person.svg";
import shield from "@/assets/sprites/work/shield.svg";
import { AdminControls } from "@/components/AdminControls";
import { ErrorBanner } from "@/components/ErrorBanner";
import { EstimationGrid } from "@/components/EstimationGrid";
import { PageLayout } from "@/components/PageLayout";
import { SessionDescription } from "@/components/SessionDescription";
import { ShareLink } from "@/components/ShareLink";
import { SpriteScatter } from "@/components/SpriteScatter";
import { Window } from "@/components/Window";
import { GridMode, WindowVariant } from "@/constants";
import { useContent } from "@/hooks";
import type { ActiveConnectionState, HoveredSquare, Selection } from "@/types";
import { useState } from "react";

interface ActiveSessionViewProps {
  sessionId: string;
  state: ActiveConnectionState;
  description: string | null;
  onSelect: (selection: Selection) => void;
  onDismissError: () => void;
  // Present for the Admin only.
  onEndSession?: () => void;
}

// The Active screen (DESIGN.md §7). One view for Participant and Admin alike —
// the Admin is a Participant with one extra capability, so the difference is
// the share bar, the End button and the chip.
//
// End sits in the header from tablet up and moves to full width under the grid
// on mobile. Work's desktop moves it once more, into the floating admin bar
// ShareLink becomes there, and leaves room under the window for that bar. All
// are rendered and CSS shows one, so the confirm dialog belongs to whichever
// the viewport draws.
export function ActiveSessionView({
  sessionId,
  state,
  description,
  onSelect,
  onDismissError,
  onEndSession,
}: ActiveSessionViewProps) {
  const [hovered, setHovered] = useState<HoveredSquare | null>(null);
  const content = useContent();

  return (
    <PageLayout
      actions={
        onEndSession && (
          <AdminControls
            onEndSession={onEndSession}
            className="hidden text-[12px] tablet:inline-flex work:h-9 work:px-4 work:text-[14px] work:desktop:hidden"
          />
        )
      }
    >
      {onEndSession && <ShareLink sessionId={sessionId} onEndSession={onEndSession} />}

      <div className="relative isolate flex justify-center px-3 pt-8 pb-16 tablet:px-10 tablet:pt-10 work:pt-4 work:pb-10 work:tablet:pt-8 work:tablet:pb-14 work:desktop:pt-10 work:desktop:pb-32">
        <SpriteScatter />

        <Window
          title={content.active.windowTitle}
          variant={WindowVariant.SESSION}
          chip={state.isAdmin ? content.role.admin : content.role.participant}
          chipIcon={state.isAdmin ? shield : person}
        >
          <div className="flex flex-col gap-1.5 work:gap-2 work:pr-20">
            <h1 className="font-display text-[20px] leading-[1.05] text-foreground tablet:text-[27px] work:text-[24px] work:leading-[1.2] work:font-medium work:tracking-[-0.01em] work:tablet:text-[28px]">
              {content.active.heading}
            </h1>
            <p className="font-body text-[14px] leading-[1.45] text-muted-foreground tablet:text-[14px] work:leading-[22px] work:tablet:text-[15px] work:tablet:leading-6">
              {content.active.intro}
            </p>
          </div>

          <SessionDescription description={description} />

          {state.error && (
            <ErrorBanner error={state.error} onDismiss={onDismissError} />
          )}

          <EstimationGrid
            axisValues={state.pointSystem.axisValues}
            mode={GridMode.INTERACTIVE}
            selection={state.selection}
            onSelect={onSelect}
            hovered={hovered}
            onHoveredChange={setHovered}
          />

          {onEndSession && (
            <AdminControls
              onEndSession={onEndSession}
              className="h-[52px] w-full text-[14px] tablet:hidden work:h-12 work:text-[15px]"
            />
          )}
        </Window>
      </div>
    </PageLayout>
  );
}
