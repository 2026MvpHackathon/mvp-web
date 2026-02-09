import type { RecentItem } from "../types";
import axiosInstance from "@/features/Auth/axiosInstance";

export const getRecentList = async (): Promise<RecentItem[]> => {
  const res = await axiosInstance.get("/api/recent");
  return res.data;
};