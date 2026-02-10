import axiosInstance from "@/features/Auth/axiosInstance";
import type { ObjectItem, ObjectApiResponse } from "../types";

export const getObjectList = async (): Promise<ObjectItem[]> => {
  const apiUrl = "/api/study/home/find/all"; // Use relative path
  const res = await axiosInstance.get<ObjectApiResponse>(apiUrl);
  return res.data.data;
};
