import * as S from "./FavoritesList.style";
import type { QuizListItem } from "../types";
import QuizAI from "@/assets/icons/Quiz/QuizAI";
import QuizDB from "@/assets/icons/Quiz/QuizDB";
import { colors } from "@/shared/values/token";
import QuizFavoritesOn from "@/assets/icons/Quiz/QuizFavoritesOn";


interface FavoritesListProps {
  items?: QuizListItem[];
  onToggleFavorite: (id: string) => void;
}

const FavoritesList = ({
  items = [],
  onToggleFavorite,
}: FavoritesListProps) => {
  return (
    <S.Wrapper>
      <S.Header>
        <span>즐겨찾기</span>
        <span>총 {items.length}문제</span>
      </S.Header>
      <S.Divider />
      <S.List>
        {items.map(item => (
          <S.Item key={item.id}>
            <S.ItemLeft>
              <S.CategoryIcon>
                {item.category === "db" ? (
                  <QuizDB color={colors.main.normal} />
                ) : (
                  <QuizAI color={colors.text.strong} />
                )}
              </S.CategoryIcon>
              <S.Label $db={item.category === "db"}>
                {item.label.length > 8
                  ? `${item.label.slice(0, 8)}...`
                  : item.label}
              </S.Label>
            </S.ItemLeft>
            <div onClick={() => onToggleFavorite(item.id)}>
              <QuizFavoritesOn/> 
            </div>
          </S.Item>
        ))}
      </S.List>
    </S.Wrapper>
  );
};

export default FavoritesList;
