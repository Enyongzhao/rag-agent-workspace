import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getCurrentUser } from '../api/auth'

function DashboardPage() {
  const currentUserQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  })

  if (currentUserQuery.isPending) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-600">Loading...</p>
      </section>
    )
  }

  if (currentUserQuery.isError) {
    return (
      <section className="rounded-lg border border-red-200 bg-white p-6">
        <h1 className="text-xl font-bold text-slate-900">
          Session expired
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Please sign in again from the login page.
        </p>
      </section>
    )
  }

  const user = currentUserQuery.data

  return (
    <section>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Overview
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Welcome back, {user.username}. Your workspace is ready.
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          Account
        </h2>

        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">User ID</dt>
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

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link
          className="rounded-lg border border-slate-200 bg-white p-5 hover:border-slate-300 hover:bg-slate-50"
          to="/dashboard/documents"
        >
          <h2 className="text-sm font-semibold text-slate-900">
            Documents
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Upload PDFs and build a knowledge base.
          </p>
        </Link>

        <Link
          className="rounded-lg border border-slate-200 bg-white p-5 hover:border-slate-300 hover:bg-slate-50"
          to="/dashboard/chat"
        >
          <h2 className="text-sm font-semibold text-slate-900">
            Chat
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Ask questions and interact with your assistant.
          </p>
        </Link>

        <Link
          className="rounded-lg border border-slate-200 bg-white p-5 hover:border-slate-300 hover:bg-slate-50"
          to="/dashboard/settings"
        >
          <h2 className="text-sm font-semibold text-slate-900">
            Settings
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Configure workspace preferences.
          </p>
        </Link>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          Week 2 progress
        </h2>

        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>React + TypeScript project setup</li>
          <li>Tailwind CSS layout system</li>
          <li>JWT login and protected routes</li>
          <li>Zustand authentication store</li>
          <li>React Query API state management</li>
        </ul>
      </div>
    </section>
  )
}

export default DashboardPage