import axios from 'axios'

interface ApiErrorResponse {
  detail: string
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.detail ?? 'Request failed'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Request failed'
}