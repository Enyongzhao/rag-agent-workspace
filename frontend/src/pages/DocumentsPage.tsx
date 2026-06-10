import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getDocuments, uploadDocument } from '../api/documents'
import { getApiErrorMessage } from '../api/errors'

function DocumentsPage() {
  const queryClient = useQueryClient()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const documentsQuery = useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments,
  })

  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      setSelectedFile(null)

      queryClient.invalidateQueries({
        queryKey: ['documents'],
      })
    },
  })

  const documents = documentsQuery.data ?? []

  function handleUpload() {
    if (!selectedFile) {
      return
    }

    uploadMutation.mutate(selectedFile)
  }

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
          Uploaded PDFs are parsed, split into chunks, embedded, and indexed.
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
              onChange={(event) => {
                setSelectedFile(event.target.files?.[0] ?? null)
              }}
            />
          </label>

          {selectedFile && (
            <p className="mt-3 text-sm text-slate-600">
              Selected: {selectedFile.name}
            </p>
          )}

          <button
            className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            type="button"
            disabled={!selectedFile || uploadMutation.isPending}
            onClick={handleUpload}
          >
            {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
          </button>

          {uploadMutation.isError && (
            <p className="mt-3 text-sm text-red-600">
              {getApiErrorMessage(uploadMutation.error)}
            </p>
          )}

          {uploadMutation.isSuccess && (
            <p className="mt-3 text-sm text-green-700">
              Document uploaded and indexed.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Document library
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Files available to your RAG assistant.
          </p>
        </div>

        {documentsQuery.isPending && (
          <p className="p-5 text-sm text-slate-600">
            Loading documents...
          </p>
        )}

        {documentsQuery.isError && (
          <p className="p-5 text-sm text-red-600">
            {getApiErrorMessage(documentsQuery.error)}
          </p>
        )}

        {!documentsQuery.isPending && documents.length === 0 && (
          <p className="p-5 text-sm text-slate-600">
            No documents uploaded yet.
          </p>
        )}

        {documents.length > 0 && (
          <div className="divide-y divide-slate-200">
            {documents.map((document) => (
              <div
                className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"
                key={document.id}
              >
                <div>
                  <h3 className="text-sm font-medium text-slate-900">
                    {document.original_filename}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {document.chunk_count} chunks · Added{' '}
                    {new Date(document.created_at).toLocaleDateString()}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {document.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default DocumentsPage