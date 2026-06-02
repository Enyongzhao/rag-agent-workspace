import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { loginUser } from '../api/auth'
import type React from 'react'
import { useAuthStore } from '../stores/authStore'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { getApiErrorMessage } from '../api/errors'

function LoginPage() {
  const navigate = useNavigate()
  const setToken = useAuthStore((state) => state.setToken)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setToken(data.access_token)
      navigate('/dashboard')
    },
  })

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    loginMutation.mutate({
      email,
      password,
    })
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <section className="w-full max-w-sm rounded-lg bg-white p-6 shadow">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Welcome back to your agent workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            autoComplete="current-password"
            required
          />

          {loginMutation.isError && (
            <p className="text-sm text-red-600">
              {getApiErrorMessage(loginMutation.error)}
            </p>
          )}

          <Button
            className="w-full"
            type="submit"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Still don't have an account?{' '}
          <Link className="font-medium text-slate-900" to="/register">
            Register
          </Link>
        </p>
      </section>
    </main>
  )
}

export default LoginPage