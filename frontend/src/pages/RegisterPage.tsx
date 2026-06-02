import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { registerUser } from '../api/auth'
import type React from 'react'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { getApiErrorMessage } from '../api/errors'

function RegisterPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      navigate('/login')
    },
  })

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    registerMutation.mutate({
      username,
      email,
      password,
    })
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <section className="w-full max-w-sm rounded-lg bg-white p-6 shadow">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Create account
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Start building your agent workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            type="text"
            autoComplete="username"
            required
          />

          <TextInput
            label="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            autoComplete="email"
            required
          />

          <TextInput
            label="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="new-password"
            required
          />

          {registerMutation.isError && (
            <p className="text-sm text-red-600">
              {getApiErrorMessage(registerMutation.error)}
            </p>
          )}

          <Button
            className="w-full"
            type="submit"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Creating...' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link className="font-medium text-slate-900" to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  )
}

export default RegisterPage