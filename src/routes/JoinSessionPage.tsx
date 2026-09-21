import { useState } from 'react'
import { Form, useActionData, useNavigation } from 'react-router'
import cardBack from '@/assets/sprites/cardback.svg'
import { PageLayout } from '@/components/PageLayout'
import { PixelProgressBar } from '@/components/PixelProgressBar'
import { Sprite } from '@/components/Sprite'
import { SpriteScatter } from '@/components/SpriteScatter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Window } from '@/components/Window'
import { FORM_WINDOW_BODY_CLASS, JOIN_WINDOW_CLASS, PixelBarSize } from '@/constants'
import { cn } from '@/lib/utils'
import { nameError } from '@/lib/validation'
import type { ActionErrorData } from '@/types'

// The Join screen (DESIGN.md §7). Only a heading, one input, the button and
// the privacy note — nothing else. The input carries no visible label; its
// placeholder and `aria-label` both say "Your name".
export function JoinSessionPage() {
  const [name, setName] = useState('')
  const [touched, setTouched] = useState(false)

  const navigation = useNavigation()
  const actionData = useActionData() as ActionErrorData | undefined

  // Checked here so "Jim@Bob" never reaches the wire. The server's
  // INVALID_NAME stays the backstop.
  const validationError = nameError(name)
  const isSubmitting = navigation.state !== 'idle'

  return (
    <PageLayout>
      <div className="relative isolate flex justify-center px-3 pt-8 pb-16 tablet:px-10 tablet:pt-10">
        <SpriteScatter />

        <Window
          title="join"
          chip="Participant"
          className={JOIN_WINDOW_CLASS}
          bodyClassName={FORM_WINDOW_BODY_CLASS}
        >
          <h1 className="font-display text-[22px] leading-[1.05] text-ink tablet:text-[30px]">
            Join session
          </h1>

          <Form method="post" className="flex flex-col gap-5 tablet:gap-6">
            <div className="flex flex-col gap-2">
              <Input
                name="name"
                value={name}
                placeholder="Your name"
                aria-label="Your name"
                autoComplete="off"
                onChange={(event) => setName(event.target.value)}
                onBlur={() => setTouched(true)}
                aria-invalid={touched && validationError !== null}
              />
              {touched && validationError && (
                <p className="text-[14px] text-abstained">{validationError}</p>
              )}
            </div>

            {actionData?.error && <p className="text-[14px] text-abstained">{actionData.error}</p>}

            {/* Pressed, it carries the inline loader (§7) — held at full
                strength rather than dimmed like a button that can't be used. */}
            <Button
              type="submit"
              size="lg"
              className={cn('w-full', isSubmitting && 'disabled:opacity-100')}
              disabled={isSubmitting || validationError !== null}
            >
              {isSubmitting && <PixelProgressBar size={PixelBarSize.INLINE} />}
              {isSubmitting ? 'Joining session…' : 'Join session'}
            </Button>
          </Form>

          <div className="flex items-start gap-3 border-2 border-ink bg-crowd-0 px-4 py-3.5">
            <Sprite source={cardBack} className="sprite-sticker h-[29px] w-6 shrink-0" />
            <p className="text-[14px] leading-normal">
              Your Selection stays private until the Admin ends the session and the Reveal shows
              everyone’s Square.
            </p>
          </div>
        </Window>
      </div>
    </PageLayout>
  )
}
