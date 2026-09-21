import { Link, useLoaderData } from 'react-router'
import spadeMark from '@/assets/sprites/logo-spade-alt.svg'
import { CopyLinkButton } from '@/components/CopyLinkButton'
import { PageLayout } from '@/components/PageLayout'
import { Sprite } from '@/components/Sprite'
import { SpriteScatter } from '@/components/SpriteScatter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Window } from '@/components/Window'
import { CREATE_WINDOW_CLASS, FORM_WINDOW_BODY_CLASS, RoutePath } from '@/constants'
import { sessionJoinUrl } from '@/lib/sessionLink'
import type { CreateFormDefaults, GetSessionResponse } from '@/types'
import { pointSystemSummary } from '@/utils'

// Create's ready state (DESIGN.md §7): the Session exists, here is its link.
// Its own route rather than a branch of the Create page, so a refresh keeps the
// link on screen — readyLoader lets only the Admin who holds its token in.
//
// "Change settings" goes back to /new with this Session's point system and
// maximum filled in. Submitting there makes a second Session; this one stays in
// the server's memory, unused, until its next restart.
// Default export so router.tsx can lazy() it directly.
export default function ReadySessionPage() {
  const session = useLoaderData() as GetSessionResponse
  const url = sessionJoinUrl(session.sessionId)
  const defaults: CreateFormDefaults = {
    pointSystemType: session.pointSystem.type,
    sliderMax: session.pointSystem.sliderMax,
  }

  return (
    <PageLayout>
      <div className="relative isolate flex justify-center px-3 pt-8 pb-16 tablet:px-10 tablet:pt-10">
        <SpriteScatter />

        <Window
          title="new-session"
          chip="Admin"
          className={CREATE_WINDOW_CLASS}
          bodyClassName={FORM_WINDOW_BODY_CLASS}
        >
          <div className="flex items-center gap-4">
            <Sprite source={spadeMark} className="size-13 shrink-0" />

            <div className="flex flex-col gap-1.5">
              <h2 className="font-display text-[20px] leading-[1.05] text-ink tablet:text-[28px]">
                Your session’s ready
              </h2>
              <p className="text-[15px] text-text-muted">{pointSystemSummary(session.pointSystem)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="sessionLink" className="text-[15px] font-extrabold">
              Share this link with the team
            </label>

            <div className="flex flex-col gap-3 tablet:flex-row">
              {/* A readonly field rather than plain text, so the link can still be
                  selected by hand where the clipboard is blocked. */}
              <Input
                id="sessionLink"
                readOnly
                value={url}
                className="truncate bg-crowd-0 font-label text-[13px]"
                onFocus={(event) => event.target.select()}
              />
              <CopyLinkButton url={url} variant="secondary" className="tablet:h-13" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3.5">
            <Button asChild size="lg" className="w-full tablet:w-auto">
              <Link to={`/${session.sessionId}/start`}>Go to the session →</Link>
            </Button>

            <Link
              to={RoutePath.NEW}
              state={defaults}
              className="px-3 py-2.5 text-[15px] font-bold text-ink underline underline-offset-4 hover:text-text-subtle"
            >
              Change settings
            </Link>
          </div>
        </Window>
      </div>
    </PageLayout>
  )
}
