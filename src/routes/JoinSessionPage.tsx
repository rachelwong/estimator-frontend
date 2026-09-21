import { useState } from 'react'
import { Form, useActionData, useNavigation } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { nameError } from '@/lib/validation'
import type { ActionErrorData } from '@/types'

export function JoinSessionPage() {
  const [name, setName] = useState('')
  const [touched, setTouched] = useState(false)

  const navigation = useNavigation()
  const actionData = useActionData() as ActionErrorData | undefined

  // Checked here so "Jim Bob" never reaches the wire. The server's
  // INVALID_NAME stays the backstop.
  const validationError = nameError(name)
  const isSubmitting = navigation.state !== 'idle'

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h2 className="mb-6 text-xl font-semibold">Join a session</h2>

      <Form method="post" className="grid gap-6">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm">
            Provide your name
          </label>
          <Input
            id="name"
            name="name"
            value={name}
            autoComplete="off"
            onChange={(event) => setName(event.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={touched && validationError !== null}
          />
          {touched && validationError && (
            <p className="text-sm text-destructive">{validationError}</p>
          )}
        </div>

        {actionData?.error && <p className="text-sm text-destructive">{actionData.error}</p>}

        <Button type="submit" disabled={isSubmitting || validationError !== null}>
          {isSubmitting ? 'Entering…' : 'Enter Session'}
        </Button>
      </Form>
    </main>
  )
}
