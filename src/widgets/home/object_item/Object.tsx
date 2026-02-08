import ObjectCard from "@/entities/object/ui/ObjectCard";
import { useObjectList } from "@/features/object/useObjectList";
import { useOpenObject } from "@/features/open-object/model/useOpenObject";
import * as S from "./Object.Style";

interface Props {
  keyword: string;
}

const ObjectItem = ({ keyword }: Props) => {
  const { items } = useObjectList();
  const open = useOpenObject();

  // keyword가 바뀔 때만 필터링
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(keyword.toLowerCase()) ||
    item.detail.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <S.container>
      {filteredItems.map(item => (
        <ObjectCard
          key={item.id}
          item={item}
          onOpen={() => open({ type: "object", id: item.id })}
        />
      ))}
    </S.container>
  );
};

export default ObjectItem;
