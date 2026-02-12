import { useEffect, useState } from "react";
import { getObjectList } from "@/entities/object/api/objectApi";
import type { ObjectItem } from "@/entities/object/types";
import { useToast } from "@/shared/ui/Toast/ToastContext";

export interface ObjectCardItem {
  id: number;
  title: string;
  detail: string;
  image: string;
}

export const useObjectList = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState<ObjectCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchObjectItems = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const data: ObjectItem[] = await getObjectList();
        setItems(
          data.map(item => ({
            id: item.materialId,
            title: item.title,
            detail: item.description,
            image: item.thumbnailUrl,
          }))
        );
      } catch {
        showToast("학습 대상 목록을 불러오는데 실패했습니다.", "error");
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchObjectItems();
  }, []);

  return { items, isLoading, isError };
};
