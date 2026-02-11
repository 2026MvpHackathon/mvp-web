// useRecentList.ts
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

// 원본 timestamp를 보관하는 내부 타입
interface RecentCardItemWithRaw extends RecentCardItem {
  _lastAccessAt: string;
}

export const useRecentList = () => {
  const [rawItems, setRawItems] = useState<RecentCardItemWithRaw[]>([]);
  const [items, setItems] = useState<RecentCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // 최초 데이터 fetch
  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const data: RecentItem[] = await getRecentList();
        const mapped: RecentCardItemWithRaw[] = data.map(item => ({
          id: item.materialId,
          title: item.title,
          detail: item.description,
          time: formatTime(item.lastAccessAt),
          image: item.thumbnailUrl,
          _lastAccessAt: item.lastAccessAt, // 원본 보관
        }));
        setRawItems(mapped);
        setItems(mapped);
      } catch (error) {
        console.error("Failed to fetch recent items:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentItems();
  }, []);

  // 1분마다 time 필드 재계산
  useEffect(() => {
    if (rawItems.length === 0) return;

    const interval = setInterval(() => {
      setItems(
        rawItems.map(item => ({
          ...item,
          time: formatTime(item._lastAccessAt),
        }))
      );
    }, 60_000); // 60초

    return () => clearInterval(interval);
  }, [rawItems]); // rawItems가 바뀔 때마다 interval 재등록

  return { items, isLoading, isError };
};