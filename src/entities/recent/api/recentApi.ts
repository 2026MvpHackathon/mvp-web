import axios from "axios";
import type { RecentItem } from "../types";

export const getRecentList = async (): Promise<RecentItem[]> => {
  const res = await axios.get("/api/recent");
  return res.data;
};