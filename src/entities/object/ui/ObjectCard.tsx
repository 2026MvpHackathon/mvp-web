import * as S from "./ObjectCard.Style";
import Arrow from "@/assets/openArrow.png";
import type { ObjectCardItem } from "@/features/object/useObjectList";

interface Props {
  item: ObjectCardItem;
  onOpen?: () => void;
}

const ObjectCard = ({ item, onOpen }: Props) => {

  return (
    <S.container onClick={onOpen}>
      <S.infoContainer>
        <S.titleArrowContainer>
          <S.title>{item.title}</S.title>
          <S.openArrow src={Arrow} />
        </S.titleArrowContainer>

        <S.detail>{item.detail}</S.detail>
      </S.infoContainer>

      <S.objectImg src={`/src/assets${item.image}`} alt={item.title} />
    </S.container>
  );
};

export default ObjectCard;

