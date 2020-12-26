export interface ApiResponse {
  data: string
}

export interface SpellError {
  candWord: string
  correctMethod: number
  end: number
  errorIdx: number
  help: string
  orgStr: string
  start: number
}
