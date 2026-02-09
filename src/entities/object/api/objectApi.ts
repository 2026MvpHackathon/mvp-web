import axiosInstance from "@/features/Auth/axiosInstance";
import type { ObjectItem, ObjectApiResponse } from "../types";

export const getObjectList = async (): Promise<ObjectItem[]> => {
  const res = await axiosInstance.get<ObjectApiResponse>("/api/study/home/find/all");
  return res.data.data;
};
