import * as S from "./FavoritesList.style";
import bookmarkIcon from "@/assets/bookmark.png";
import dbQuizIcon from "@/assets/DBquiz.png";
import aiQuizIcon from "@/assets/AIquiz.png";
import type { QuizListItem } from "../types";

const categoryIcons = { db: dbQuizIcon, ai: aiQuizIcon } as const;

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
              <S.CategoryIcon
                src={categoryIcons[item.category]}
                alt={item.category === "db" ? "제품별" : "AI퀴즈"}
              />
              <span>{item.label}</span>
            </S.ItemLeft>
            <S.ListIcon src={bookmarkIcon} alt="즐겨찾기" />
          </S.Item>
        ))}
      </S.List>
    </S.Wrapper>
  );
};

export default FavoritesList;
