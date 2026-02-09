import type { RecentItem, RecentApiResponse } from "../types";
import axiosInstance from "@/features/Auth/axiosInstance";

export const getRecentList = async (): Promise<RecentItem[]> => {
  const res = await axiosInstance.get<RecentApiResponse>("/api/study/home/find/recent");
  return res.data.data;
};