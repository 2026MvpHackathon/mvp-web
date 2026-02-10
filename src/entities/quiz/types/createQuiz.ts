export interface QuizRequest {
  materialId: number;
  [key: string]: unknown;
}

export interface QuizResponse {
  data?: unknown;
  [key: string]: unknown;
}

export interface SubmitResultRequest {
  [key: string]: unknown;
}

export interface SubmitResultResponse {
  data?: unknown;
  [key: string]: unknown;
}
