import { useEffect, useRef, useState } from "react";
import * as S from "./ProblemDropdown.style";

const ProblemDropdown = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const serverOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];
    setOptions(serverOptions);
  }, []);

  useEffect(() => {
    if (options.length > 0) {
      setSelected(options[options.length - 1]);
    }
  }, [options]);

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
      <S.DropdownBox onClick={() => setOpen(prev => !prev)}>
        <S.Value>{selected}</S.Value>
        <S.Arrow $open={open}>▾</S.Arrow>
      </S.DropdownBox>

      <S.Label>문제</S.Label>

      {open && (
        <S.OptionList>
          {options.map(option => (
            <S.Option
              key={option}
              onClick={() => {
                setSelected(option);
                setOpen(false);
              }}
            >
              {option}
            </S.Option>
          ))}
        </S.OptionList>
      )}
    </S.Wrapper>
  );
};

export default ProblemDropdown;
