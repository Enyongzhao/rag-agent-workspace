export interface RagSource {
  content: string
  metadata: Record<string, unknown>
}

export interface RagQueryRequest {
  question: string
  document_id?: number
}

export interface RagQueryResponse {
  question: string
  answer: string
  sources: RagSource[]
}
