import ObjectCard from "@/entities/object/ui/ObjectCard";
import * as S from './Object.Style'
import { useObjectList } from "@/features/object/useObjectList";
import { useOpenObject } from "@/features/open-object/model/useOpenObject";

const ObjectList = () => {
  const { items } = useObjectList();
  const open = useOpenObject();

  return (
    <>
      <S.container>
        {items.map(item => (
          <ObjectCard
            key={item.id}
            item={item}
            onOpen={() => open({ type: "object", id: item.id })}
          />
        ))}
      </S.container>
    </>
  );
};

export default ObjectList;
