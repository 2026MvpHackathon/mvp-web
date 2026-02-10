import axios from "axios";
import type { RecentItem, RecentApiResponse } from "../types";

export const getRecentList = async (): Promise<RecentItem[]> => {
  const apiUrl = new URL("/api/study/home/find/recent", import.meta.env.VITE_API_URL).href;
  

  const token = localStorage.getItem('accessToken');
  
  const res = await axios.get<RecentApiResponse>(apiUrl, {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  });
  
  return res.data.data;
};
