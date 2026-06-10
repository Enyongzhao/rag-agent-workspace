export interface RagSource {
  content: string
  metadata: Record<string, unknown>
}

export interface RagQueryRequest {
  question: string
}

export interface RagQueryResponse {
  question: string
  results: RagSource[]
}