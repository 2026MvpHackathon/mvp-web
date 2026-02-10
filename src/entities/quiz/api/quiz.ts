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
