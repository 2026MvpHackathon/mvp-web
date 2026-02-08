import { useEffect, useState } from "react";
import { OBJECT_MOCK_DATA } from "@/entities/object/mock/object.mock";

export interface ObjectCardItem {
  id: number;
  title: string;
  detail: string;
  image: string;
}

export const useObjectList = () => {
  const [items, setItems] = useState<ObjectCardItem[]>([]);

  useEffect(() => {
    setItems(
      OBJECT_MOCK_DATA.map(item => ({
        id: item.id,
        title: item.title,
        detail: item.detail,
        image: item.imageUrl,
      }))
    );
  }, []);

  return { items };
};
