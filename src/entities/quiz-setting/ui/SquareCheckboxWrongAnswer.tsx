import { useState } from "react";
import * as S from "./SquareCheckbox.style";
import icon from '@/assets/check.png'

const WrongAnswerCheckbox = () => {
  const [checked, setChecked] = useState(false);

  return (
    <S.Wrapper $checked={checked} onClick={() => setChecked(!checked)}>
      <S.Box $checked={checked}>
        {checked && (
          <S.CheckIcon src={icon} />
        )}
      </S.Box>
      <S.Label $checked={checked}>오답 포함</S.Label>
    </S.Wrapper>
  );
};

export default WrongAnswerCheckbox;
