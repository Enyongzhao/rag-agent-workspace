import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../api/auth'
import { useAuthStore } from '../stores/authStore'

function DashboardPage() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const currentUserQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  })

  function handleLogout() {
    logout()
    navigate('/login')
  }

  if (currentUserQuery.isPending) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-600">Loading...</p>
      </main>
    )
  }

  if (currentUserQuery.isError) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <section className="w-full max-w-md rounded-lg bg-white p-6 shadow">
          <h1 className="text-xl font-bold text-slate-900">
            Session expired
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Please sign in again to continue.
          </p>
          <button
            className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            type="button"
            onClick={handleLogout}
          >
            Back to login
          </button>
        </section>
      </main>
    )
  }

  const user = currentUserQuery.data

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <section className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Welcome back, {user.username}.
            </p>
          </div>

          <button
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="mt-6 rounded-md border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Current user
          </h2>

          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">ID</dt>
              <dd className="font-medium text-slate-900">{user.id}</dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Username</dt>
              <dd className="font-medium text-slate-900">{user.username}</dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Email</dt>
              <dd className="font-medium text-slate-900">{user.email}</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  )
}

export default DashboardPage