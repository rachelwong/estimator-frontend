import { useState } from 'react'
import { Form, useActionData, useLocation, useNavigation } from 'react-router'
import { PageLayout } from '@/components/PageLayout'
import { PixelProgressBar } from '@/components/PixelProgressBar'
import { PointSystemPicker } from '@/components/PointSystemPicker'
import { RangeSlider } from '@/components/RangeSlider'
import { SpriteScatter } from '@/components/SpriteScatter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Window } from '@/components/Window'
import {
  CREATE_WINDOW_CLASS,
  FORM_WINDOW_BODY_CLASS,
  PixelBarSize,
  PointSystemType,
} from '@/constants'
import { cn } from '@/lib/utils'
import { nameError } from '@/lib/validation'
import type { ActionErrorData, CreateFormDefaults } from '@/types'
import type { PointSystemType as PointSystemTypeValue } from '@/types'

// The Create screen (DESIGN.md §7): window "new-session", your name, the point
// system, the highest axis value, and Create session. No grid preview.
//
// "Change settings" on the ready screen comes back here with the point system
// and maximum in location state. Every other way in starts blank.
// Default export so router.tsx can lazy() it directly.
export default function CreateSessionPage() {
  const defaults = useLocation().state as CreateFormDefaults | null
  const [adminName, setAdminName] = useState('')
  const [touched, setTouched] = useState(false)
  const [pointSystemType, setPointSystemType] = useState<PointSystemTypeValue>(
    defaults?.pointSystemType ?? PointSystemType.NUMERICAL,
  )
  const [sliderMax, setSliderMax] = useState(defaults?.sliderMax ?? 0)

  const navigation = useNavigation()
  const actionData = useActionData() as ActionErrorData | undefined

  const validationError = nameError(adminName)
  const isSubmitting = navigation.state === 'submitting'

  // A max of 0 is the slider's starting point, and a grid of one Square is no
  // grid at all — so the form waits for both answers before it will go.
  const canSubmit = validationError === null && sliderMax > 0

  // Switching point system clears the max, so the admin consciously re-picks
  // instead of inheriting a full-size grid from the previous choice.
  function handlePointSystemChange(next: PointSystemTypeValue) {
    setPointSystemType(next)
    setSliderMax(0)
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
          <div className="flex flex-col gap-1.5">
            <h2 className="font-display text-[20px] leading-[1.05] text-ink tablet:text-[28px]">
              New session
            </h2>
            <p className="text-[16px] leading-[1.45] text-text-muted">
              You’ll be the Admin: you pick like everyone else, and you’re the one who ends the
              session.
            </p>
          </div>

          <Form method="post" className="flex flex-col gap-5 tablet:gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="adminName" className="text-[15px] font-extrabold">
                Your name
              </label>
              <Input
                id="adminName"
                name="adminName"
                value={adminName}
                placeholder="e.g. Rachel"
                autoComplete="off"
                onChange={(event) => setAdminName(event.target.value)}
                onBlur={() => setTouched(true)}
                aria-invalid={touched && validationError !== null}
              />
              {touched && validationError && (
                <p className="text-[14px] text-abstained">{validationError}</p>
              )}
            </div>

            <PointSystemPicker value={pointSystemType} onChange={handlePointSystemChange} />

            <RangeSlider
              pointSystemType={pointSystemType}
              value={sliderMax}
              onChange={setSliderMax}
            />

            {actionData?.error && <p className="text-[14px] text-abstained">{actionData.error}</p>}

            {/* Pressed, it carries the inline loader (§7) — held at full
                strength rather than dimmed like a button that can't be used. */}
            <Button
              type="submit"
              size="lg"
              className={cn('w-full', isSubmitting && 'disabled:opacity-100')}
              disabled={isSubmitting || !canSubmit}
            >
              {isSubmitting && <PixelProgressBar size={PixelBarSize.INLINE} />}
              {isSubmitting ? 'Creating session…' : 'Create session'}
            </Button>
          </Form>
        </Window>
      </div>
    </PageLayout>
  )
}
