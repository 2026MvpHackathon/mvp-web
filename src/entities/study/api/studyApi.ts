import { apiClient } from '../../../shared/api/client'
import type {
  ApiResponse,
  ChatMessage,
  MaterialPart,
  QuizRegisterResult,
  StudyHomeItem,
  StudyNote,
  StudySession,
  StudySessionPart,
  StudySessionSavePayload,
} from '../types'

export const createStudySession = async (materialId: number) => {
  const res = await apiClient.post<ApiResponse<StudySession>>('/api/study/session', {
    materialId,
  })
  return res.data
}

export const getStudySession = async (sessionId: number) => {
  const res = await apiClient.get<ApiResponse<StudySession>>(`/api/study/session/${sessionId}`)
  return res.data
}

export const saveStudySession = async (sessionId: number, payload: StudySessionSavePayload) => {
  const res = await apiClient.post<ApiResponse<null>>(
    `/api/study/session/${sessionId}/save`,
    payload,
  )
  return res.data
}

export const getStudySessionParts = async (sessionId: number) => {
  const res = await apiClient.get<ApiResponse<StudySessionPart[]>>(
    `/api/study/session/${sessionId}/parts/list`,
  )
  return res.data
}

export const toggleStudySessionPart = async (sessionId: number, sessionPartId: number) => {
  const res = await apiClient.patch<ApiResponse<null>>(
    `/api/study/session/${sessionId}/parts/${sessionPartId}/toggle`,
  )
  return res.data
}

export const getMaterialParts = async (materialId: number) => {
  const res = await apiClient.get<ApiResponse<MaterialPart[]>>(`/api/parts/list/${materialId}`)
  return res.data
}

export const askChat = async (payload: {
  studySessionId: number
  question: string
  materialId?: number
  modelId?: number
}) => {
  const res = await apiClient.post<ApiResponse<ChatMessage>>('/api/chat/ask', payload)
  return res.data
}

export const getChatHistory = async (studySessionId: number) => {
  const res = await apiClient.get<ApiResponse<ChatMessage[]>>(
    `/api/chat/history/${studySessionId}`,
  )
  return res.data
}

export const getStudyNotes = async (sessionId: number) => {
  const res = await apiClient.get<ApiResponse<StudyNote[]>>(
    `/api/study/session/${sessionId}/notes`,
  )
  return res.data
}

export const getStudyHomeAll = async () => {
  const res = await apiClient.get<ApiResponse<StudyHomeItem[]>>('/api/study/home/find/all')
  return res.data
}

export const getStudyHomeRecent = async (max = 3) => {
  const res = await apiClient.get<ApiResponse<StudyHomeItem[]>>('/api/study/home/find/recent', {
    params: { max },
  })
  return res.data
}

export const createStudyNote = async (
  sessionId: number,
  payload: { sessionPartId: number; x: number; y: number; z: number; text: string },
) => {
  const res = await apiClient.post<ApiResponse<StudyNote>>(
    `/api/study/session/${sessionId}/notes`,
    payload,
  )
  return res.data
}

export const updateStudyNote = async (sessionId: number, noteId: number, text: string) => {
  const res = await apiClient.patch<ApiResponse<null>>(
    `/api/study/session/${sessionId}/notes/${noteId}`,
    { text },
  )
  return res.data
}

export const deleteStudyNote = async (sessionId: number, noteId: number) => {
  const res = await apiClient.delete<ApiResponse<null>>(
    `/api/study/session/${sessionId}/notes/${noteId}`,
  )
  return res.data
}

export const registerQuiz = async (payload: {
  materialId: number
  modelId?: number
  userQuestion: string
  aiAnswer: string
  isFavorite: boolean
}) => {
  const { modelId, ...rest } = payload
  const body = Number.isFinite(modelId) ? { ...rest, modelId } : rest
  const res = await apiClient.post<ApiResponse<QuizRegisterResult>>('/api/quiz/register', body)
  return res.data
}

