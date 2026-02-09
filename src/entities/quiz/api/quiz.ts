import axiosInstance from "@/features/auth/axiosInstance";
import type { QuizRequest, QuizResponse } from "../types/createQuiz"

export const createQuiz = async (
  payload: QuizRequest
): Promise<QuizResponse> => {
  const res = await axiosInstance.post<QuizResponse>(
    "/api/quiz/generate",
    payload
  );

  return res.data;
};
