import * as S from "./SelectCircle.style";
import icon from '@/assets/check.png'

const SelectCircle = ({ selected, onToggle, label }: { selected: boolean; onToggle: () => void; label: string }) => {
  return (
    <S.Wrapper $selected={selected} onClick={onToggle}>
      <S.Circle $selected={selected}>
        <S.Icon src={icon} />
      </S.Circle>
      <S.Label $selected={selected}>{label}</S.Label>
    </S.Wrapper>
  );
};

export default SelectCircle;
