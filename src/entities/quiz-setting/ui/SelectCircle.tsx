import { useState } from "react";
import * as S from "./SelectCircle.style";
import icon from '@/assets/check.png'

const SelectCircle = () => {
  const [selected, setSelected] = useState(false);

  return (
    <S.Wrapper $selected={selected} onClick={() => setSelected(!selected)}>
      <S.Circle $selected={selected}>
        <S.Icon src={icon} />
      </S.Circle>
      <S.Label $selected={selected}>전체</S.Label>
    </S.Wrapper>
  );
};

export default SelectCircle;
