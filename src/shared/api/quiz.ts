import axiosInstance from '@/features/Auth/axiosInstance'; // Use axiosInstance for authenticated calls
import type { QuizCategory } from '@/features/quiz/quiz-category-select/QuizCategorySelect';
import type { QuizListItem } from '@/entities/quiz-setting/types';

// Assuming these interfaces match the backend response
export interface ProductItemResponse {
  id: string;
  title: string;
  image: string;
}

export interface AIQuizAnswerItemResponse {
  id: string;
  answerText: string;
}

export interface AverageRateResponse {
  rate: string; // e.g., "75%"
}

// Response structure for /api/quiz/questions
export interface QuizQuestionsResponse {
  products: ProductItemResponse[];
  aiAnswers: AIQuizAnswerItemResponse[];
  // ... other question related data if any
}

// Actual API calls
export const getQuizQuestions = async (category: QuizCategory): Promise<QuizQuestionsResponse> => {
  const response = await axiosInstance.get<QuizQuestionsResponse>(`/api/quiz/questions`, {
    params: { category }
  });
  return response.data;
};

export const fetchProducts = async (category: QuizCategory): Promise<ProductItemResponse[]> => {
  const data = await getQuizQuestions(category);
  return data.products; // Extract products from the response
};

export const fetchAIQuizAnswers = async (category: QuizCategory): Promise<AIQuizAnswerItemResponse[]> => {
  const data = await getQuizQuestions(category);
  return data.aiAnswers; // Extract AI answers from the response
};

export const fetchFavoriteItems = async (): Promise<QuizListItem[]> => {
  const response = await axiosInstance.get<QuizListItem[]>(`/api/quiz/favorites`);
  return response.data;
};

export const fetchWrongAnswerItems = async (): Promise<QuizListItem[]> => {
  const response = await axiosInstance.get<QuizListItem[]>(`/api/quiz/wrong-answers`);
  return response.data;
};

export const fetchAverageCorrectRate = async (): Promise<AverageRateResponse> => {
  const response = await axiosInstance.get<AverageRateResponse>(`/api/quiz/average-rate`);
  return response.data;
};

export const submitQuizResult = async (resultData: any): Promise<any> => {
  const response = await axiosInstance.post(`/api/quiz/submit-result`, resultData);
  return response.data;
};

export const registerQuiz = async (registrationData: any): Promise<any> => {
  const response = await axiosInstance.post(`/api/quiz/register`, registrationData);
  return response.data;
};

export const generateQuiz = async (settings: QuizStartSettings): Promise<any> => {
  const response = await axiosInstance.post(`/api/quiz/generate`, settings);
  console.log("Quiz Generation Response:", response); // Log the response
  return response.data;
};

export interface QuizStartSettings {
  category: QuizCategory;
  productIds: string[];
  aiAnswerIds: string[];
  isFavoriteIncluded: boolean;
  isWrongAnswerIncluded: boolean;
  numberOfProblems: number;
}