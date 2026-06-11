import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../api/auth'

interface AdminRouteProps {
  children: React.ReactNode
}

function AdminRoute({ children }: AdminRouteProps) {
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
    return <Navigate to="/login" replace />
  }

  if (currentUserQuery.data.role !== 'admin') {
    return (
      <section className="rounded-lg border border-red-200 bg-white p-6">
        <h1 className="text-xl font-bold text-slate-900">
          Access denied
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          You need an administrator account to view this page.
        </p>
      </section>
    )
  }

  return children
}

export default AdminRoute