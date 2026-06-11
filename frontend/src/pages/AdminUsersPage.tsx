import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createUser, deleteUser, getUsers, updateUser } from '../api/users'
import { getApiErrorMessage } from '../api/errors'
import type { AdminUser, UserRole } from '../types/user'

function AdminUsersPage() {
  const queryClient = useQueryClient()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('user')
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [editUsername, setEditUsername] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPassword, setEditPassword] = useState('')

  const usersQuery = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getUsers,
  })

  const users = usersQuery.data ?? []

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      setUsername('')
      setEmail('')
      setPassword('')
      setRole('user')

      queryClient.invalidateQueries({ 
        queryKey: ['adminUsers'] 
      })
    },  
  })

  const updateUserMutation = useMutation({
    mutationFn: ({
      userId,
      username,
      email,
      password,
    }: {
      userId: number
      username: string
      email: string
      password: string
    }) => updateUser(
      userId,
      {
        username,
        email,
        ...(password ? { password } : {}),
      },
    ),
    onSuccess: () => {
      setEditingUserId(null)
      setEditUsername('')
      setEditEmail('')
      setEditPassword('')

      queryClient.invalidateQueries({
        queryKey: ['adminUsers'],
      })
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['adminUsers'],
      })
    },
  })

  const handleCreateUser: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    const shouldCreate = window.confirm(
      'Are you sure you want to create this user?',
    )

    if (!shouldCreate) {
      return
    }

    createUserMutation.mutate({
      username,
      email,
      password,
      role,
    })
  }

  function handleStartEdit(user: AdminUser) {
    setEditingUserId(user.id)
    setEditUsername(user.username)
    setEditEmail(user.email)
    setEditPassword('')
  }

  const handleUpdateUser: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    if (editingUserId === null) {
      return
    }

    const shouldSave = window.confirm(
      'Are you sure you want to save these changes?',
    )

    if (!shouldSave) {
      return
    }

    updateUserMutation.mutate({
      userId: editingUserId,
      username: editUsername,
      email: editEmail,
      password: editPassword,
    })
  }

  function handleCancelEdit() {
    setEditingUserId(null)
    setEditUsername('')
    setEditEmail('')
    setEditPassword('')
  }

  function handleDeleteUser(userId: number) {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this user?',
    )

    if (!shouldDelete) {
      return
    }

    deleteUserMutation.mutate(userId)
  }
  
  return (
    <section>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          User management
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage application users and roles.
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Users
          </h2>
        </div>

        {usersQuery.isPending && (
          <p className="p-5 text-sm text-slate-600">
            Loading users...
          </p>
        )}

        {usersQuery.isError && (
          <p className="p-5 text-sm text-red-600">
            {getApiErrorMessage(usersQuery.error)}
          </p>
        )}

        {!usersQuery.isPending && users.length === 0 && (
          <p className="p-5 text-sm text-slate-600">
            No users found.
          </p>
        )}

        {users.length > 0 && (
          <div>
            <div className="grid grid-cols-[1fr_160px_220px] border-b border-slate-200 bg-slate-50 px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span>Username</span>
              <span>Role</span>
              <span>Action</span>
            </div>

            <div className="divide-y divide-slate-200">
            {users.map((user) => (
              <div
                className="grid grid-cols-[1fr_160px_220px] items-center px-5 py-4 text-center"
                key={user.id}
              >
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-slate-900">
                    {user.username}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {user.email}
                  </p>
                </div>

                <div className="flex justify-center">
                  <span className="w-28 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {user.role}
                  </span>
                </div>

                <div className="flex justify-center gap-2">
                  <button
                    className="w-20 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                    type="button"
                    onClick={() => handleStartEdit(user)}
                    disabled={updateUserMutation.isPending}
                  >
                    Edit
                  </button>

                  <button
                    className="w-20 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-red-300"
                    type="button"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={deleteUserMutation.isPending}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}

        {editingUserId !== null && (
          <form
            className="border-t border-slate-200 p-5"
            onSubmit={handleUpdateUser}
          >
            <h2 className="text-sm font-semibold text-slate-900">
              Edit user
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Username
                </span>
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                  value={editUsername}
                  onChange={(event) => setEditUsername(event.target.value)}
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Email
                </span>
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                  value={editEmail}
                  onChange={(event) => setEditEmail(event.target.value)}
                  type="email"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  New password
                </span>
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                  value={editPassword}
                  onChange={(event) => setEditPassword(event.target.value)}
                  placeholder="Leave blank to keep current password"
                  type="password"
                />
              </label>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
                type="submit"
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? 'Saving...' : 'Save changes'}
              </button>

              <button
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                type="button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {updateUserMutation.isError && (
          <p className="border-t border-slate-200 p-5 text-sm text-red-600">
            {getApiErrorMessage(updateUserMutation.error)}
          </p>
        )}

        {deleteUserMutation.isError && (
          <p className="border-t border-slate-200 p-5 text-sm text-red-600">
            {getApiErrorMessage(deleteUserMutation.error)}
          </p>
        )}
      </div>

      <form
        className="mt-6 rounded-lg border border-slate-200 bg-white p-5"
        onSubmit={handleCreateUser}
      >
        <h2 className="text-sm font-semibold text-slate-900">
          Create user
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Username
            </span>
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Email
            </span>
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Password
            </span>
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Role
            </span>
            <select
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </label>
        </div>

        {createUserMutation.isError && (
          <p className="mt-3 text-sm text-red-600">
            {getApiErrorMessage(createUserMutation.error)}
          </p>
        )}

        {createUserMutation.isSuccess && (
          <p className="mt-3 text-sm text-green-700">
            User created.
          </p>
        )}

        <button
          className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
          disabled={createUserMutation.isPending}
        >
          {createUserMutation.isPending ? 'Creating...' : 'Create user'}
        </button>
      </form>
    </section>
  )
}

export default AdminUsersPage
