import { useEffect, useState } from "react";
import { formatTime } from "@/entities/recent/lib/formatRecentTime";
import { RECENT_MOCK_DATA } from "@/entities/recent/mock/recent.mock";

export interface RecentCardItem {
  id: number;
  title: string;
  detail: string;
  time: string;
  image: string;
}

export const useRecentList = () => {
  const [items, setItems] = useState<RecentCardItem[]>([]);

  useEffect(() => {
    setItems(
      RECENT_MOCK_DATA.map(item => ({
        id: item.id,
        title: item.title,
        detail: item.detail,
        time: formatTime(item.time),
        image: item.image,
      }))
    );
  }, []);

  return { items };
};
