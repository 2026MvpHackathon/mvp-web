import axios from "axios";
import type { ObjectItem } from "../types";

export const getObjectList = async (): Promise<ObjectItem[]> => {
  const res = await axios.get("/api/object");
  return res.data;
};
