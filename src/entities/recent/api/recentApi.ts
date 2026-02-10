import axiosInstance from "@/features/Auth/axiosInstance"; // Use configured axiosInstance
import type { RecentItem, RecentApiResponse } from "../types";

export const getRecentList = async (): Promise<RecentItem[]> => {
  const apiUrl = "/api/study/home/find/recent"; // Use relative path

  const res = await axiosInstance.get<RecentApiResponse>(apiUrl); // axiosInstance handles headers automatically
  
  return res.data.data;
};
