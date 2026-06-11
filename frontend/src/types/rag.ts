export interface RagSource {
  content: string
  metadata: Record<string, unknown>
  score: number
}

export interface RagQueryRequest {
  question: string
  document_id?: number
  top_k?: number
}

export interface RagQueryResponse {
  question: string
  answer: string
  sources: RagSource[]
}
