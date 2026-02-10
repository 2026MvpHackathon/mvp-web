import * as S from "./SelectObject.style";
import Icon from "@/assets/check.png";
import DroneImg from '@/assets/drone.png'

const SelectObject = () => {
  return (
    <S.Select>
      <S.HiddenCheckbox type="checkbox" />

      <S.Container>
        <S.TitleSelectContainer>
          <S.Title>Drone</S.Title>

          <S.Circle>
            <S.Icon src={Icon} />
          </S.Circle>
        </S.TitleSelectContainer>
        <S.objectImg src={DroneImg}/>
      </S.Container>
    </S.Select>

  );
};

export default SelectObject;
