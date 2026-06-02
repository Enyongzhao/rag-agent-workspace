function SettingsPage() {
  return (
    <section>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Settings
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage workspace preferences and future agent configuration.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Account preferences
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Profile and account settings will be available later.
          </p>

          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Display name
              </span>
              <input
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                placeholder="Coming soon"
                type="text"
                disabled
              />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-md border border-slate-200 p-3">
              <span>
                <span className="block text-sm font-medium text-slate-900">
                  Email notifications
                </span>
                <span className="block text-sm text-slate-500">
                  Receive updates about indexing and agent runs.
                </span>
              </span>
              <input className="h-4 w-4" type="checkbox" disabled />
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Agent configuration
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Model, retrieval, and tool settings will be connected in later weeks.
          </p>

          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Default mode
              </span>
              <select
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                disabled
              >
                <option>RAG assistant</option>
                <option>Agent with tools</option>
              </select>
            </label>

            <label className="flex items-center justify-between gap-4 rounded-md border border-slate-200 p-3">
              <span>
                <span className="block text-sm font-medium text-slate-900">
                  Show reasoning steps
                </span>
                <span className="block text-sm text-slate-500">
                  Display agent execution steps in the chat UI.
                </span>
              </span>
              <input className="h-4 w-4" type="checkbox" checked disabled />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          Future configuration
        </h2>

        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>Embedding model and vector database selection</li>
          <li>RAG chunk size and retrieval top-k</li>
          <li>LangGraph tool routing strategy</li>
          <li>Streaming and tracing preferences</li>
        </ul>
      </div>
    </section>
  )
}

export default SettingsPage