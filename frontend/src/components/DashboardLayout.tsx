import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../api/auth'

function DashboardLayout() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const currentUserQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  })

  const currentUser = currentUserQuery.data
  const isAdmin = currentUser?.role === 'admin'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-medium ${
      isActive
        ? 'bg-slate-900 text-white'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl">
        <aside className="w-60 border-r border-slate-200 bg-white p-4">
          <h1 className="text-lg font-bold text-slate-900">
            Agent Workspace
          </h1>

          <nav className="mt-6 flex flex-col gap-1">
            <NavLink to="/dashboard" end className={linkClass}>
              Overview
            </NavLink>
            <NavLink to="/dashboard/documents" className={linkClass}>
              Documents
            </NavLink>
            <NavLink to="/dashboard/chat" className={linkClass}>
              Chat
            </NavLink>
            <NavLink to="/dashboard/settings" className={linkClass}>
              Settings
            </NavLink>
            {isAdmin && (
              <NavLink to="/dashboard/admin/users" className={linkClass}>
                Users
              </NavLink>
            )}
          </nav>

          <button
            className="mt-6 w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </aside>

        <section className="flex-1 p-8">
          <Outlet />
        </section>
      </div>
    </main>
  )
}

export default DashboardLayout