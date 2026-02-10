import { useState, useEffect } from "react";
import SelectObject from "@/entities/quiz-setting/ui/SelectObject";
import SelectCircle from "@/entities/quiz-setting/ui/SelectCircle";
import FavoriteCheckbox from "@/entities/quiz-setting/ui/SquareCheckboxBookmark";
import WrongAnswerCheckbox from "@/entities/quiz-setting/ui/SquareCheckboxWrongAnswer";
import ProblemDropdown from "@/entities/quiz-setting/ui/ProblemDropdown";
import FavoritesList from "@/entities/quiz-setting/ui/FavoritesList";
import WrongAnswerList from "@/entities/quiz-setting/ui/WrongAnswerList";
import type { QuizListItem } from "@/entities/quiz-setting/types";
import QuizCategorySelect, {
  type QuizCategory,
} from "@/features/quiz/quiz-category-select/QuizCategorySelect";
import AIQuizAnswerObject from "@/entities/quiz-setting/ui/AIQuizAnswerObject";
import * as S from "./Quiz.style";

import {
  fetchProducts,
  fetchAIQuizAnswers,
  fetchFavoriteItems,
  fetchWrongAnswerItems,
  fetchAverageCorrectRate,
  type ProductItemResponse,
  type AIQuizAnswerItemResponse,
} from "@/shared/api/quiz";

interface SelectableProductItem extends ProductItemResponse {
  selected: boolean;
}

interface SelectableAIQuizAnswerItem extends AIQuizAnswerItemResponse {
  selected: boolean;
}

const QuizPage = () => {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory>("db");

  const [products, setProducts] = useState<SelectableProductItem[]>([]);
  const [aiQuizAnswers, setAiQuizAnswers] = useState<SelectableAIQuizAnswerItem[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<QuizListItem[]>([]);
  const [wrongAnswerItems, setWrongAnswerItems] = useState<QuizListItem[]>([]);
  const [averageCorrectRate, setAverageCorrectRate] = useState<string | null>(null);

  const [, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [favorites, wrongAnswers, avgRate] = await Promise.all([
          fetchFavoriteItems(),
          fetchWrongAnswerItems(),
          fetchAverageCorrectRate(),
        ]);
        setFavoriteItems(favorites);
        setWrongAnswerItems(wrongAnswers);
        setAverageCorrectRate(avgRate.rate);
      } catch (err) {
        console.error("Failed to fetch initial quiz data:", err);
        setError("초기 데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        if (selectedCategory === "db") {
          const fetchedProducts = await fetchProducts(selectedCategory);
          setProducts(fetchedProducts.map(p => ({ ...p, selected: false })));
          setAiQuizAnswers([]); 
        } else {
          const fetchedAnswers = await fetchAIQuizAnswers(selectedCategory);
          setAiQuizAnswers(fetchedAnswers.map(a => ({ ...a, selected: false })));
          setProducts([]);
        }
      } catch (err) {
        console.error(`Failed to fetch data for category ${selectedCategory}:`, err);
        setError("카테고리 데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    loadCategoryData();
  }, [selectedCategory]);

  const isAllSelected = products.every((product) => product.selected) && products.length > 0;
  const isAllAIAnswersSelected = aiQuizAnswers.every(answer => answer.selected) && aiQuizAnswers.length > 0;

  const handleProductToggle = (id: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, selected: !product.selected }
          : product,
      ),
    );
  };

  const handleSelectAllToggle = () => {
    const newSelectAllState = !isAllSelected;
    setProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        selected: newSelectAllState,
      })),
    );
  };

  const handleAIAnswerToggle = (id: string) => {
    setAiQuizAnswers(prevAnswers =>
      prevAnswers.map(answer =>
        answer.id === id ? { ...answer, selected: !answer.selected } : answer
      )
    );
  };

  const handleSelectAllAIAnswersToggle = () => {
    const newSelectAllState = !isAllAIAnswersSelected;
    setAiQuizAnswers(prevAnswers =>
      prevAnswers.map(answer => ({ ...answer, selected: newSelectAllState }))
    );
  };

  const handleStartQuiz = () => {
    setIsQuizStarted(true);
    console.log("Quiz Started!");
    console.log("Selected Category:", selectedCategory);
    console.log("Selected Products:", products.filter(p => p.selected));
    console.log("Selected AI Answers:", aiQuizAnswers.filter(a => a.selected));
  };



  if (error) {
    return <div>오류: {error}</div>;
  }

  if (isQuizStarted) {
    return <div>퀴즈 진행 중...</div>;
  }

  return (
    <S.Layout>
      <S.LeftPanel>
        <S.AverageRateContainer>
          <S.AverageRateValue>{averageCorrectRate || 'N/A'}</S.AverageRateValue>
          <S.AverageRateDescription>평균 정답률이에요!</S.AverageRateDescription>
        </S.AverageRateContainer>
        <FavoritesList items={favoriteItems} />
        <WrongAnswerList items={wrongAnswerItems} />
      </S.LeftPanel>

      <S.Main>
        <QuizCategorySelect onCategoryChange={setSelectedCategory} />
        <S.ProductSelectionContainer>
          {selectedCategory === "db" ? (
            <>
              <S.SelectAllWrapper>
                <SelectCircle
                  selected={isAllSelected}
                  onToggle={handleSelectAllToggle}
                  label="전체 선택"
                />
              </S.SelectAllWrapper>
              <S.ProductGridContainer>
                {products.map((product) => (
                  <SelectObject
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    image={product.image}
                    selected={product.selected}
                    onToggle={handleProductToggle}
                  />
                ))}
              </S.ProductGridContainer>
            </>
          ) : ( // selectedCategory === "ai"
            <>
              <S.SelectAllWrapper>
                <SelectCircle
                  selected={isAllAIAnswersSelected}
                  onToggle={handleSelectAllAIAnswersToggle}
                  label="전체 선택"
                />
              </S.SelectAllWrapper>
              <S.ProductGridContainer>
                {aiQuizAnswers.map((answer) => (
                  <AIQuizAnswerObject
                    key={answer.id}
                    id={answer.id}
                    answerText={answer.answerText}
                    selected={answer.selected}
                    onToggle={handleAIAnswerToggle}
                  />
                ))}
              </S.ProductGridContainer>
            </>
          )}
        </S.ProductSelectionContainer>
        <S.CheckboxRow>
          <FavoriteCheckbox />
          <WrongAnswerCheckbox />
        </S.CheckboxRow>
        <ProblemDropdown />
        <S.StartQuizButtonWrapper>
          <S.StartQuizButton onClick={handleStartQuiz}>퀴즈 시작</S.StartQuizButton>
        </S.StartQuizButtonWrapper>
      </S.Main>
    </S.Layout>
  );
};

export default QuizPage;