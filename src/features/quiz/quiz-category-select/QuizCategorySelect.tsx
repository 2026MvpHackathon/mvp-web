import { useState } from "react";
import * as S from "./QuizCategorySelect.style";

export type QuizCategory = "db" | "ai";

interface QuizCategorySelectProps {
  onCategoryChange?: (category: QuizCategory) => void;
}

const QuizCategorySelect = ({ onCategoryChange }: QuizCategorySelectProps) => {
  const [category, setCategory] = useState<QuizCategory>("db");

  const handleCategoryChange = (newCategory: QuizCategory) => {
    setCategory(newCategory);
    if (onCategoryChange) {
      onCategoryChange(newCategory);
    }
  };

  return (
    <S.RangeSection>
      <S.RangeHeaderRow>
        <S.RangeLabel>퀴즈 범위 설정</S.RangeLabel>
        <S.CategorySliderWrapper>
          <S.CategorySliderTrack $index={category === "db" ? 0 : 1} />
          <S.CategoryOption
            type="button"
            $active={category === "db"}
            onClick={() => handleCategoryChange("db")}
          >
            제품별
          </S.CategoryOption>
          <S.CategoryOption
            type="button"
            $active={category === "ai"}
            onClick={() => handleCategoryChange("ai")}
          >
            AI퀴즈
          </S.CategoryOption>
        </S.CategorySliderWrapper>
      </S.RangeHeaderRow>
      <S.RangeRow>
      </S.RangeRow>
    </S.RangeSection>
  );
};

export default QuizCategorySelect;