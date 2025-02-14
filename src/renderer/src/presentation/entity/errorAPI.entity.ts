export interface APIError {
  response?: {
    status?: number
    message?: string
    data?: {
      id?: string
      message?: string
      success?: boolean
      detail?: string
    }
  }
  message?: string
}
