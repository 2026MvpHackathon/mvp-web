import RecentCard from "@/entities/recent/ui/RecentCard";
import { useRecentList } from "@/features/recent/model/useRecentList";
import { useOpenObject } from "@/features/open-object/model/useOpenObject";
import * as S from "./Recent.style";

const Recent = () => {
  const { items, isLoading, isError } = useRecentList();
  const open = useOpenObject();

  if (isLoading) {
    return <S.container>Loading recent items...</S.container>;
  }

  if (isError) {
    return <S.container>Error loading recent items.</S.container>;
  }

  return (
    <S.container>
      {items.map(item => (
        <RecentCard
          key={item.id}
          item={item}
          onOpen={() => open({ type: "recent", id: item.id })}
        />
      ))}
    </S.container>
  );
};

export default Recent;
