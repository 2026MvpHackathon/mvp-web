import * as S from "./RecentCard.Style";
import type { RecentCardItem } from "@/features/recent/model/useRecentList";

interface Props {
  item: RecentCardItem;
  onOpen?: () => void;
}

const RecentCard = ({ item, onOpen }: Props) => {

  return (
    <S.container>
      <S.item>
        <S.infoContainer>
          <S.titleTimeContainer>
            <S.title>{item.title}</S.title>
            <S.time>{item.time}</S.time>
          </S.titleTimeContainer>

          <S.detail>{item.detail}</S.detail>
        </S.infoContainer>

        <S.bottom>
          <S.openButtonContainer>
            <S.openButton onClick={onOpen}>열기</S.openButton>
          </S.openButtonContainer>
          <S.img src={`${item.image}`} alt={item.title} />
        </S.bottom>
      </S.item>
    </S.container>
  );
};

export default RecentCard;