function ChatPage() {
  const messages = [
    {
      id: 1,
      role: 'user',
      content: 'What does the uploaded product spec say about onboarding?',
    },
    {
      id: 2,
      role: 'assistant',
      content:
        'The onboarding flow should guide users through account setup, document upload, and their first assistant query.',
    },
  ]

  const steps = [
    'Classified question as document-related',
    'Searched indexed documents',
    'Generated answer with retrieved context',
  ]

  return (
    <section className="flex h-[calc(100vh-4rem)] flex-col">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Chat
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Ask questions and interact with your RAG assistant.
        </p>
      </div>

      <div className="mt-6 grid min-h-0 flex-1 gap-4 lg:grid-cols-[1fr_280px]">
        <div className="flex min-h-0 flex-col rounded-lg border border-slate-200 bg-white">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((message) => (
              <div
                className={
                  message.role === 'user'
                    ? 'ml-auto max-w-xl rounded-lg bg-slate-900 px-4 py-3 text-sm text-white'
                    : 'mr-auto max-w-xl rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-800'
                }
                key={message.id}
              >
                {message.content}
              </div>
            ))}
          </div>

          <form className="border-t border-slate-200 p-4">
            <div className="flex gap-3">
              <input
                className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                placeholder="Ask about your documents..."
                type="text"
                disabled
              />
              <button
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
                type="button"
                disabled
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Static placeholder for now. RAG and streaming will come later.
            </p>
          </form>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Agent steps
          </h2>
          <ol className="mt-4 space-y-3">
            {steps.map((step, index) => (
              <li className="flex gap-3 text-sm" key={step}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-medium text-white">
                  {index + 1}
                </span>
                <span className="pt-0.5 text-slate-600">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  )
}

export default ChatPage