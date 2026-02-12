import axiosInstance from "@/features/Auth/axiosInstance";
import type {
  QuizRequest,
  QuizResponse,
  SubmitResultRequest,
  SubmitResultResponse,
} from "../types/createQuiz";

export const createQuiz = async (
  payload: QuizRequest
): Promise<QuizResponse> => {
  const res = await axiosInstance.post<QuizResponse>(
    "/api/quiz/generate",
    payload
  );

  return res.data;
};

export const submitQuizResult = async (
  payload: SubmitResultRequest
): Promise<SubmitResultResponse> => {
  const res = await axiosInstance.post<SubmitResultResponse>(
    "/api/quiz/submit-result",
    payload
  );

  return res.data;
};

export const toggleFavorite = async (
  quizQuestionId: number,
  isFavorite: boolean
): Promise<any> => {
  const response = await axiosInstance.patch(
    `/api/quiz/${quizQuestionId}/favorite?isFavorite=${isFavorite}`
  );
  return response.data;
};


