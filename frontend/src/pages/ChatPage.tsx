import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { queryRag } from '../api/rag'
import { getApiErrorMessage } from '../api/errors'
import type { RagSource } from '../types/rag'

interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  sources?: RagSource[]
}

function ChatPage() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const queryMutation = useMutation({
    mutationFn: queryRag,
    onSuccess: (data) => {
      const sourceSummary =
        data.results.length > 0
          ? `Found ${data.results.length} relevant chunks.`
          : 'No relevant chunks found.'

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: sourceSummary,
          sources: data.results,
        },
      ])
    },
  })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedQuestion = question.trim()

    if (!trimmedQuestion || queryMutation.isPending) {
      return
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        role: 'user',
        content: trimmedQuestion,
      },
    ])

    queryMutation.mutate({
      question: trimmedQuestion,
    })

    setQuestion('')
  }

  const steps = [
    'Embedded the question',
    'Searched indexed document chunks',
    'Returned the most relevant sources',
  ]

  return (
    <section className="flex h-[calc(100vh-4rem)] flex-col">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Chat
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Ask questions and inspect retrieved document context.
        </p>
      </div>

      <div className="mt-6 grid min-h-0 flex-1 gap-4 lg:grid-cols-[1fr_280px]">
        <div className="flex min-h-0 flex-col rounded-lg border border-slate-200 bg-white">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.length === 0 && (
              <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-600">
                Ask a question about your uploaded documents.
              </div>
            )}

            {messages.map((message) => (
              <div
                className={
                  message.role === 'user'
                    ? 'ml-auto max-w-xl rounded-lg bg-slate-900 px-4 py-3 text-sm text-white'
                    : 'mr-auto max-w-2xl rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-800'
                }
                key={message.id}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>

                {message.sources && message.sources.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {message.sources.map((source, index) => (
                      <div
                        className="rounded-md border border-slate-200 bg-white p-3 text-slate-700"
                        key={`${message.id}-${index}`}
                      >
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold text-slate-900">
                            Source {index + 1}
                          </span>
                          <span className="text-xs text-slate-500">
                            Page {String(source.metadata.page ?? 'unknown')}
                          </span>
                        </div>
                        <p className="line-clamp-6 whitespace-pre-wrap text-xs leading-5">
                          {source.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {queryMutation.isPending && (
              <div className="mr-auto max-w-xl rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-600">
                Searching documents...
              </div>
            )}

            {queryMutation.isError && (
              <div className="mr-auto max-w-xl rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {getApiErrorMessage(queryMutation.error)}
              </div>
            )}
          </div>

          <form className="border-t border-slate-200 p-4" onSubmit={handleSubmit}>
            <div className="flex gap-3">
              <input
                className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                placeholder="Ask about your documents..."
                type="text"
                value={question}
                disabled={queryMutation.isPending}
                onChange={(event) => setQuestion(event.target.value)}
              />
              <button
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
                type="submit"
                disabled={!question.trim() || queryMutation.isPending}
              >
                Send
              </button>
            </div>
          </form>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Retrieval steps
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