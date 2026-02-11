import * as S from "./FavoritesList.style";
import bookmarkIcon from "@/assets/bookmark.png";
import type { QuizListItem } from "../types";
import QuizAI from "@/assets/icons/Quiz/QuizAI";
import QuizDB from "@/assets/icons/Quiz/QuizDB";
import { colors } from "@/shared/values/token";


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
              {item.category === "db" ?
                <S.Label $db={true}>{item.label}</S.Label>
              :
                <S.Label $db={false}>{item.label}</S.Label>
              }
            </S.ItemLeft>
            <S.ListIcon src={bookmarkIcon} alt="즐겨찾기" />
          </S.Item>
        ))}
      </S.List>
    </S.Wrapper>
  );
};

export default FavoritesList;
