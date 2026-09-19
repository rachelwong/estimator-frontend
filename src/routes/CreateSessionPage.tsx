import { useState } from 'react'
import { Form, useActionData, useNavigation } from 'react-router'
import { PointSystemPicker } from '@/components/PointSystemPicker'
import { RangeSlider } from '@/components/RangeSlider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PointSystemType } from '@/constants'
import { nameError } from '@/lib/validation'
import type { CreateSessionActionData } from '@/routes/loaders'
import type { PointSystemType as PointSystemTypeValue } from '@/types'

export function CreateSessionPage() {
  const [adminName, setAdminName] = useState('')
  const [touched, setTouched] = useState(false)
  const [pointSystemType, setPointSystemType] = useState<PointSystemTypeValue>(
    PointSystemType.NUMERICAL,
  )
  const [sliderMax, setSliderMax] = useState(0)

  const navigation = useNavigation()
  const actionData = useActionData() as CreateSessionActionData | undefined

  const validationError = nameError(adminName)
  const isSubmitting = navigation.state === 'submitting'

  // Switching point system clears the max, so the admin consciously re-picks
  // instead of inheriting a full-size grid from the previous choice.
  function handlePointSystemChange(next: PointSystemTypeValue) {
    setPointSystemType(next)
    setSliderMax(0)
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h2 className="mb-6 text-xl font-semibold">Create a new session</h2>

      <Form method="post" className="grid gap-6">
        <div className="grid gap-2">
          <label htmlFor="adminName" className="text-sm">
            Provide your name
          </label>
          <Input
            id="adminName"
            name="adminName"
            value={adminName}
            autoComplete="off"
            onChange={(event) => setAdminName(event.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={touched && validationError !== null}
          />
          {touched && validationError && (
            <p className="text-sm text-destructive">{validationError}</p>
          )}
        </div>

        <div className="grid gap-2">
          <span className="text-sm">Select a point system</span>
          <PointSystemPicker value={pointSystemType} onChange={handlePointSystemChange} />
        </div>

        <RangeSlider
          pointSystemType={pointSystemType}
          value={sliderMax}
          onChange={setSliderMax}
        />

        {actionData?.error && <p className="text-sm text-destructive">{actionData.error}</p>}

        <Button type="submit" disabled={isSubmitting || validationError !== null}>
          {isSubmitting ? 'Starting…' : 'Start Session'}
        </Button>
      </Form>
    </main>
  )
}
