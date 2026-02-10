import * as S from "./SquareCheckbox.style";
import icon from '@/assets/check.png'

interface FavoriteCheckboxProps {
  checked: boolean;
  onToggle: () => void;
}

const FavoriteCheckbox = ({ checked, onToggle }: FavoriteCheckboxProps) => {
  return (
    <S.Wrapper $checked={checked} onClick={onToggle}>
      <S.Box $checked={checked}>
        {checked && (
          <S.CheckIcon src={icon} />
        )}
      </S.Box>
      <S.Label $checked={checked}>즐겨찾기 포함</S.Label>
    </S.Wrapper>
  );
};

export default FavoriteCheckbox;