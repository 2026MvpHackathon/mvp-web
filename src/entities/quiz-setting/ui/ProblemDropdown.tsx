import { useEffect, useRef, useState } from "react";
import * as S from "./ProblemDropdown.style";

interface ProblemDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const ProblemDropdown = ({ value, onChange }: ProblemDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const serverOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];
    setOptions(serverOptions);
  }, []);

  useEffect(() => {
    // If the options load after the initial render, ensure the value is set to a valid option.
    // If the provided value is not in options, default to the last option.
    if (options.length > 0 && !options.includes(value)) {
      onChange(options[options.length - 1]);
    }
  }, [options, value, onChange]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <S.Wrapper ref={wrapperRef}>
      <S.DropdownWrapper>
        <S.DropdownBox onClick={() => setOpen(prev => !prev)}>
          <S.Value>{value}</S.Value>
          <S.Arrow $open={open}>▾</S.Arrow>
        </S.DropdownBox>

        {open && (
          <S.OptionList>
          {options.map(option => (
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
