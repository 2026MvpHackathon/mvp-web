import axiosInstance from '@/features/Auth/axiosInstance';
import type { QuizCategory } from '@/features/quiz/quiz-category-select/QuizCategorySelect';
export interface StudySummaryResponse {
  title: string;
  description: string;
  thumbnailUrl: string;
  materialId: number;
  sessionId: number;
  lastAccessAt: string;
}

export interface BaseResponseDataListStudySummaryResponse {
  status: number;
  message: string;
  data: StudySummaryResponse[];
}

export interface QuizQuestionListResponse {
  quizQuestionId: number;
  userQuestion: string;
  aiAnswerSummary: string;
}

export interface BaseResponseDataListQuizQuestionListResponse {
  status: number;
  message: string;
  data: QuizQuestionListResponse[];
}
// --- End New Interfaces ---

// --- Original Interfaces still in use ---
export interface ProductItemResponse {
  id: string; // Material ID (string conversion)
  title: string;
  image: string; // Thumbnail URL
  problemCount: number; // Added problemCount
}

export interface AIQuizAnswerItemResponse {
  problemCount: number;
  id: string; // Quiz Question ID (string conversion)
  answerText: string; // AI Answer Summary
}

export interface AverageRateResponse { // Still exists in Quiz.tsx, will remove later
  rate: string; // e.g., "75%"
}

// --- Removed QuizQuestionsResponse as getQuizQuestions is removed ---


// --- Modified fetchProducts ---
export const fetchProducts = async (): Promise<ProductItemResponse[]> => {
  const response = await axiosInstance.get<BaseResponseDataListStudySummaryResponse>(`/api/study/home/find/all`);
  return response.data.data.map(item => ({
    id: item.materialId.toString(),
    title: item.title,
    image: item.thumbnailUrl,
    problemCount: 8,
  }));
};

// --- Modified fetchAIQuizAnswers ---
export const fetchAIQuizAnswers = async (): Promise<AIQuizAnswerItemResponse[]> => {
  const response = await axiosInstance.get<BaseResponseDataListQuizQuestionListResponse>(`/api/quiz/questions`);
  return response.data.data.map(item => ({
    id: item.quizQuestionId.toString(),
    answerText: item.aiAnswerSummary,
    problemCount: 1,
  }));
};

export const fetchAverageCorrectRate = async (): Promise<AverageRateResponse> => {
  const response = await axiosInstance.get<AverageRateResponse>(`/api/quiz/average-rate`);
  return response.data;
};

// --- Removed fetchFavoriteItems ---
// --- Removed fetchWrongAnswerItems ---
// --- Removed fetchAverageCorrectRate ---


export const submitQuizResult = async (resultData: any): Promise<any> => {
  const response = await axiosInstance.post(`/api/quiz/submit-result`, resultData);
  return response.data;
};

export const registerQuiz = async (registrationData: any): Promise<any> => {
  const response = await axiosInstance.post(`/api/quiz/register`, registrationData);
  return response.data;
};

// --- This generateQuiz seems unused or redundant with startQuizSession, keeping for now ---
export const generateQuiz = async (settings: StartQuizPayload): Promise<any> => {
  const response = await axiosInstance.post(`/api/quiz/generate`, settings);
  console.log("Quiz Generation Response:", response); // Log the response
  return response.data;
};

// New interface for QuizGenerateRequest based on OpenAPI spec
export interface QuizGenerateRequest {
  quizQuestionIds?: number[]; // Optional
  materialId?: number; // Optional, assuming one is selected or derived
  isFavorite: boolean;
  isIncorrect: boolean;
  numberOfQuestions: number;
}

// Renamed from QuizStartSettings as it's primarily used to generate quiz payload
export interface StartQuizPayload {
  category: QuizCategory;
  productIds: string[];
  aiAnswerIds: string[];
  isFavoriteIncluded: boolean;
  isWrongAnswerIncluded: boolean;
  numberOfProblems: number;
}

export const startQuizSession = async (payload: StartQuizPayload): Promise<any> => {
  // Determine materialId from selected products or AI answers
  // This assumes materialId in QuizGenerateRequest maps to product/AI answer ID and is an integer.
  // This also assumes a quiz is generated for a single material if multiple are selected on frontend.
  let materialId: number | undefined;
  if (payload.productIds.length > 0) {
    materialId = parseInt(payload.productIds[0], 10);
  } else if (payload.aiAnswerIds.length > 0) {
    materialId = parseInt(payload.aiAnswerIds[0], 10);
  }

  // Construct the QuizGenerateRequest payload
  const quizGenerateRequest: QuizGenerateRequest = {
    // quizQuestionIds: [], // Omit if not explicitly providing specific question IDs
    materialId: materialId, // Use the derived materialId
    isFavorite: payload.isFavoriteIncluded,
    isIncorrect: payload.isWrongAnswerIncluded,
    numberOfQuestions: payload.numberOfProblems,
  };

  // Using axiosInstance, not apiClient
  const response = await axiosInstance.post(`/api/quiz/generate`, quizGenerateRequest);
  return response.data;
};