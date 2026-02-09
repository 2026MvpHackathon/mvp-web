import { useEffect, useState } from "react";
import { getObjectList } from "@/entities/object/api/objectApi";
import type { ObjectItem } from "@/entities/object/types";

export interface ObjectCardItem {
  id: number;
  title: string;
  detail: string;
  image: string;
}

export const useObjectList = () => {
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
      } catch (error) {
        console.error("Failed to fetch object items:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchObjectItems();
  }, []);

  return { items, isLoading, isError };
};
