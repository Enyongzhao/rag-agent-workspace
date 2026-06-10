import { apiClient } from './client'
import type { RagQueryRequest, RagQueryResponse } from '../types/rag'

export async function queryRag(
  data: RagQueryRequest,
): Promise<RagQueryResponse> {
  const response = await apiClient.post<RagQueryResponse>(
    '/api/rag/query',
    data,
  )

  return response.data
}