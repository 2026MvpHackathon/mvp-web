import * as S from "./WrongAnswerList.style";
import wrongAnswerIcon from "@/assets/wrongAnswer.png";
import type { QuizListItem } from "../types";
import QuizDB from "@/assets/icons/Quiz/QuizDB";
import QuizAI from "@/assets/icons/Quiz/QuizAI";
import { colors } from "@/shared/values/token";


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
              <S.CategoryIcon>
                {item.category === "db" ? <QuizDB color={colors.main.normal}/>:<QuizAI color={colors.text.strong}/>}
             </S.CategoryIcon>            
             <S.Label $db={item.category === "db"}>
              {item.label.length > 8 ? `${item.label.slice(0, 8)}...` : item.label}
            </S.Label>            
            </S.ItemLeft>
            <S.ListIcon src={wrongAnswerIcon} alt="오답" />
          </S.Item>
        ))}
      </S.List>
    </S.Wrapper>
  );
};

export default WrongAnswerList;
