import axiosInstance from "@/features/Auth/axiosInstance";
import type { ObjectItem, ObjectApiResponse } from "../types";

export const getObjectList = async (): Promise<ObjectItem[]> => {
  const apiUrl = new URL("/api/study/home/find/all", import.meta.env.VITE_API_URL).href;
  const res = await axiosInstance.get<ObjectApiResponse>(apiUrl);
  return res.data.data;
};
