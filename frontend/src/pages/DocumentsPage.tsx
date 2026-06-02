function DocumentsPage() {
  const documents = [
    {
      id: 1,
      name: 'product-spec.pdf',
      status: 'Indexed',
      chunks: 42,
      createdAt: '2026-06-02',
    },
    {
      id: 2,
      name: 'agent-notes.pdf',
      status: 'Processing',
      chunks: 18,
      createdAt: '2026-06-01',
    },
  ]

  return (
    <section>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Documents
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Upload source files that your RAG assistant can search later.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          Upload PDF
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          PDF upload will be connected to the backend in the RAG week.
        </p>

        <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-6">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Choose file
            </span>
            <input
              className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700"
              type="file"
              accept="application/pdf"
              disabled
            />
          </label>

          <p className="mt-3 text-xs text-slate-500">
            Static placeholder for now. Backend upload will come in Week 4.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Document library
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Example documents showing the future indexed file list.
          </p>
        </div>

        <div className="divide-y divide-slate-200">
          {documents.map((document) => (
            <div
              className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"
              key={document.id}
            >
              <div>
                <h3 className="text-sm font-medium text-slate-900">
                  {document.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {document.chunks} chunks · Added {document.createdAt}
                </p>
              </div>

              <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {document.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DocumentsPage