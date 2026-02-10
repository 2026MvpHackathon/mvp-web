import * as S from "./SelectObject.style";
import checkIcon from "@/assets/check.png";

interface SelectObjectProps {
  id: string; // To uniquely identify the object
  title: string;
  image: string;
  selected: boolean;
  onToggle: (id: string) => void;
}

const SelectObject = ({ id, title, image, selected, onToggle }: SelectObjectProps) => {
  return (
    <S.Container $selected={selected} onClick={() => onToggle(id)}>
      <S.TitleSelectContainer>
        <S.Title>{title}</S.Title>
        <S.Circle $selected={selected}>
          <S.Icon src={checkIcon} />
        </S.Circle>
      </S.TitleSelectContainer>
      <S.objectImg src={image}/>
    </S.Container>
  );
};

export default SelectObject;
