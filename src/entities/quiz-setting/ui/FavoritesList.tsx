import * as S from "./FavoritesList.style";
import type { QuizListItem } from "../types";
import QuizAI from "@/assets/icons/Quiz/QuizAI";
import QuizDB from "@/assets/icons/Quiz/QuizDB";
import { colors } from "@/shared/values/token";
import VisibilityOn from "@/assets/icons/VisibilityOn";


interface FavoritesListProps {
  items?: QuizListItem[];
}

const FavoritesList = ({ items = [] }: FavoritesListProps) => {
  return (
    <S.Wrapper>
      <S.Header>
        <span>즐겨찾기</span>
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
            <VisibilityOn size={"17px"} />
          </S.Item>
        ))}
      </S.List>
    </S.Wrapper>
  );
};

export default FavoritesList;
