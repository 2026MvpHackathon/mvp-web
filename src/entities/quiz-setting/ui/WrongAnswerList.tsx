import * as S from "./WrongAnswerList.style";
import wrongAnswerIcon from "@/assets/wrongAnswer.png";
import dbQuizIcon from "@/assets/DBquiz.png";
import aiQuizIcon from "@/assets/AIquiz.png";
import type { QuizListItem } from "../types";

const categoryIcons = { db: dbQuizIcon, ai: aiQuizIcon } as const;

interface WrongAnswerListProps {
  items?: QuizListItem[];
}

const WrongAnswerList = ({ items = [] }: WrongAnswerListProps) => {
  return (
    <S.Wrapper>
        <S.Header>
        <span>오답</span>
        <span>총 {items.length}문제</span>
      </S.Header>
      <S.Divider />
      <S.List>
        {items.map((item) => (
          <S.Item key={item.id}>
            <S.ItemLeft>
              <S.CategoryIcon
                src={categoryIcons[item.category]}
                alt={item.category === "db" ? "제품별" : "AI퀴즈"}
              />
              <span>{item.label}</span>
            </S.ItemLeft>
            <S.ListIcon src={wrongAnswerIcon} alt="오답" />
          </S.Item>
        ))}
      </S.List>
    </S.Wrapper>
  );
};

export default WrongAnswerList;
