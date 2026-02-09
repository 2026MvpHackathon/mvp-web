import axiosInstance from "@/features/Auth/axiosInstance";
import type { ObjectItem } from "../types";

export const getObjectList = async (): Promise<ObjectItem[]> => {
  const res = await axiosInstance.get("/api/object");
  return res.data;
};
