import * as S from "./SquareCheckbox.style";
import icon from '@/assets/check.png'

interface WrongAnswerCheckboxProps {
  checked: boolean;
  onToggle: () => void;
}

const WrongAnswerCheckbox = ({ checked, onToggle }: WrongAnswerCheckboxProps) => {
  return (
    <S.Wrapper $checked={checked} onClick={onToggle}>
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
