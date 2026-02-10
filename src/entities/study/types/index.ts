export type ApiResponse<T> = {
  status: number
  message: string
  data: T
}

export type StudySession = {
  title: string
  detail: string
  position: [number, number, number]
  quaternion: [number, number, number, number]
  target: [number, number, number]
  zoom: number
  view: string
  materialId: number
  sessionId: number
  createdAt: string
}

export type StudySessionSavePayload = {
  view: string
  position: [number, number, number]
  quaternion: [number, number, number, number]
  target: [number, number, number]
  zoom: number
}

export type StudySessionPart = {
  name: string
  isVisible: boolean
  modelId: number
  imageUrl: string
  sessionPartId: number
  position: [number, number, number]
  rotation: [number, number, number, number]
  scale: [number, number, number]
}

export type MaterialPart = {
  name: string
  description: string
  detail: string
  imageUrl: string
  modelId: number
  createdAt: string
  updatedAt: string
}

export type ChatMessage = {
  messageId: number
  studySessionId: number
  messageContent: string
  messageType: string
  timestamp: string
}

export type StudyNote = {
  noteId: number
  sessionPartId: number
  position: [number, number, number]
  text: string
  createdAt: string
  updatedAt: string
}

export type StudyHomeItem = {
  title: string
  description: string
  thumbnailUrl: string
  materialId: number
  sessionId: number
  lastAccessAt: string
}

export type QuizRegisterResult = {
  createdAt: string
  updatedAt: string
  id: number
  favorite: boolean
  incorrect: boolean
}

