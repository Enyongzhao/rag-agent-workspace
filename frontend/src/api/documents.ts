import { apiClient } from './client'
import type { DocumentItem } from '../types/document'

export async function getDocuments(): Promise<DocumentItem[]> {
  const response = await apiClient.get<DocumentItem[]>('/api/documents')

  return response.data
}

export async function uploadDocument(file: File): Promise<DocumentItem> {
  const formData = new FormData()

  formData.append('file', file)

  const response = await apiClient.post<DocumentItem>(
    '/api/documents/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )

  return response.data
}

export async function deleteDocument(
  documentId: number,
): Promise<void> {
  await apiClient.delete(`/api/documents/${documentId}`)
}