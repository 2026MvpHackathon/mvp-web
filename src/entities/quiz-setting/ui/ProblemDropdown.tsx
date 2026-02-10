import { useEffect, useState } from "react";
import * as S from "./ProblemDropdown.style";

interface ProblemDropdownProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
}

const ProblemDropdown = ({ value, onChange, max }: ProblemDropdownProps) => {
  const [open, setOpen] = useState(false);

  const options = Array.from({ length: max }, (_, i) => i + 1);

  useEffect(() => {
    if (max > 0 && value > max) {
      onChange(max);
    }
  }, [max, value, onChange]);

  return (
    <S.Wrapper>
      <S.DropdownWrapper>
        <S.DropdownBox onClick={() => setOpen((prev) => !prev)}>
          <S.Value>{value}</S.Value>
          <S.Arrow $open={open}>▾</S.Arrow>
        </S.DropdownBox>

        {open && (
          <S.OptionList>
            {options.map((option) => (
              <S.Option
                key={option}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                {option}
              </S.Option>
            ))}
          </S.OptionList>
        )}
      </S.DropdownWrapper>

      <S.Label>문제</S.Label>
    </S.Wrapper>
  );
};

export default ProblemDropdown;
