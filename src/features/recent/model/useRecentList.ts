import { useEffect, useState } from "react";
import { formatTime } from "@/entities/recent/lib/formatRecentTime";
import { getRecentList } from "@/entities/recent/api/recentApi";
import type { RecentItem } from "@/entities/recent/types";

export interface RecentCardItem {
  id: number;
  title: string;
  detail: string;
  time: string;
  image: string;
}

export const useRecentList = () => {
  const [items, setItems] = useState<RecentCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const data: RecentItem[] = await getRecentList();
        setItems(
          data.map(item => ({
            id: item.materialId,
            title: item.title,
            detail: item.description,
            time: formatTime(item.lastAccessAt),
            image: item.thumbnailUrl,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch recent items:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentItems();
  }, []);

  return { items, isLoading, isError };
};
