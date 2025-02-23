export type FieldError = {
  error: string
  field: string
}

export type BaseResponse<D = {}> = {
  resultCode: number
  messages: string[]
  fieldsErrors: FieldError[]
  data: D
}
