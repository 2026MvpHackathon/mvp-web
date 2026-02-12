import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import SelectObject from "@/entities/quiz-setting/ui/SelectObject";
import SelectCircle from "@/entities/quiz-setting/ui/SelectCircle";
import FavoriteCheckbox from "@/entities/quiz-setting/ui/SquareCheckboxBookmark";
import WrongAnswerCheckbox from "@/entities/quiz-setting/ui/SquareCheckboxWrongAnswer";
import ProblemDropdown from "@/entities/quiz-setting/ui/ProblemDropdown";
import QuizCategorySelect, {
  type QuizCategory,
} from "@/features/quiz/quiz-category-select/QuizCategorySelect";
import AIQuizAnswerObject from "@/entities/quiz-setting/ui/AIQuizAnswerObject";

import * as S from "./Quiz.style";
import { useToast } from "@/shared/ui/Toast/ToastContext";

import {
  fetchProducts,
  fetchAIQuizAnswers,
  fetchWrongAnswerList,
  fetchFavoritesList,
  type ProductItemResponse,
  type StartQuizPayload,
  type QuizItemResponse,
  deleteQuizQuestion, // Added deleteQuizQuestion
  toggleFavorite,
} from "@/shared/api/quiz";

import type { QuizListItem } from "@/entities/quiz-setting/types";
import FavoritesList from "@/entities/quiz-setting/ui/FavoritesList";
import WrongAnswerList from "@/entities/quiz-setting/ui/WrongAnswerList";

interface SelectableProductItem extends ProductItemResponse {
  problemCount: number;
  selected: boolean;
}

interface SelectableQuizItemResponse extends QuizItemResponse {
  id: string; // Add id property
  problemCount: number;
  selected: boolean;
}

const QuizPage = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] =
    useState<QuizCategory>("db");
  const [products, setProducts] = useState<SelectableProductItem[]>([]);
  const [aiQuizAnswers, setAiQuizAnswers] =
    useState<SelectableQuizItemResponse[]>([]);




  const [favoriteItems, setFavoriteItems] = useState<QuizListItem[]>([]);
  const [wrongAnswerItems, setWrongAnswerItems] = useState<QuizListItem[]>([]);

  const [averageCorrectRate, setAverageCorrectRate] =
    useState<string>("N/A");

  const [, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFavoriteIncluded, setIsFavoriteIncluded] = useState(false);
  const [isWrongAnswerIncluded, setIsWrongAnswerIncluded] = useState(false);
  const [numberOfProblems, setNumberOfProblems] = useState(10);

  /** 초기 데이터 */
  useEffect(() => {
    const storedAverageRate = localStorage.getItem("averageQuizAccuracy");
    if (storedAverageRate) {
      setAverageCorrectRate(`${storedAverageRate}%`);
    } else {
      // 히스토리가 없으면 N/A
      setAverageCorrectRate("N/A");
    }
  }, []
  );

  const loadFavorites = async () => {
    const fetchedFavorites = await fetchFavoritesList();
    setFavoriteItems(
      fetchedFavorites.map((item: QuizItemResponse) => ({
        id: item.quizQuestionId.toString(),
        label: item.question,
        category: item.category as QuizCategory,
      }))
    );
  };

  /** 초기 데이터 및 틀린 문제/즐겨찾기 목록 로드 */
  useEffect(() => {
    const loadQuizLists = async () => {
      try {
        // 1. 평균 정답률 로드 (moved from above useEffect to consolidate)
        const storedAverageRate = localStorage.getItem("averageQuizAccuracy");
        setAverageCorrectRate(storedAverageRate ? `${storedAverageRate}%` : "N/A");

        // 2. 즐겨찾기 목록 로드
        loadFavorites();

        // 3. 틀린 문제 목록 로드
        const fetchedWrongAnswers = await fetchWrongAnswerList();
        setWrongAnswerItems(
          fetchedWrongAnswers.map((item: QuizItemResponse) => ({
            id: item.quizQuestionId.toString(),
            label: item.question,
            category: item.category as QuizCategory, // Assuming category from API matches QuizCategory
          }))
        );
      } catch (err) {
        console.error("Failed to load quiz lists:", err);
        setError("문제 목록을 불러오는데 실패했습니다.");
      }
    };

    loadQuizLists();
  }, []); // 의존성 배열 확인: 한 번만 실행됨

  const handleToggleFavorite = async (id: string) => {
    try {
      await toggleFavorite(parseInt(id, 10), false);
      showToast("즐겨찾기에서 삭제되었습니다.", "success");
      await loadFavorites(); // Reload the favorites list
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      showToast("즐겨찾기 상태 변경에 실패했습니다.", "error");
    }
  };


  /** 카테고리별 로딩 */
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);

        if (selectedCategory === "db") {
          const data = await fetchProducts();
          setProducts(data.map((p) => ({ ...p, selected: false })));
          setAiQuizAnswers([]);
        } else {
          const data = await fetchAIQuizAnswers(); // This now returns QuizItemResponse[]
          setAiQuizAnswers(
            data.map((a) => ({
              ...a,
              id: a.quizQuestionId.toString(), // Add id property for consistent usage
              problemCount: 1, // Assuming problemCount is 1 for AI Quiz Answers
              selected: false,
            }))
          );
          setProducts([]);
        }
      } catch {
        setError("데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [selectedCategory]);

  // const isAllSelected =
  //   products.length > 0 && products.every((p) => p.selected);
  const isAllAISelected =
    aiQuizAnswers.length > 0 && aiQuizAnswers.every((a) => a.selected);

  const isAnySelected =
    products.some((p) => p.selected) ||
    aiQuizAnswers.some((a) => a.selected);

  const getMaxNumberOfProblems = () => {
    const total =
      selectedCategory === "db"
        ? products
            .filter((p) => p.selected)
            .reduce((sum, p) => sum + p.problemCount, 0)
        : aiQuizAnswers
            .filter((a) => a.selected)
            .reduce((sum, a) => sum + a.problemCount, 0);

    return total;
  };

  const handleStartQuiz = () => {
    if (!isAnySelected) {
      showToast("문제를 선택해 주세요", "info");
      return;
    }

    // 선택된 교재/답변 정보 확인
    const selectedProducts = products.filter((p) => p.selected);
    const selectedAIAnswers = aiQuizAnswers.filter((a) => a.selected);
    
    console.log("선택된 교재:", selectedProducts);
    console.log("선택된 AI 답변:", selectedAIAnswers);
    console.log("총 문제 수:", getMaxNumberOfProblems());
    console.log("요청할 문제 수:", numberOfProblems);

    const payload: StartQuizPayload = {
      category: selectedCategory,
      productIds: products.filter((p) => p.selected).map((p) => p.id),
      aiAnswerIds: aiQuizAnswers.filter((a) => a.selected).map((a) => a.id),
      isFavoriteIncluded,
      isWrongAnswerIncluded,
      numberOfProblems,
    };

    console.log("저장할 퀴즈 설정:", payload);

    localStorage.setItem("quizSettings", JSON.stringify(payload));
    navigate("/quiz/during");
  };

  const handleDeleteQuizQuestion = async (id: string) => {
    try {
      const quizQuestionId = parseInt(id, 10);
      await deleteQuizQuestion(quizQuestionId);
      showToast("퀴즈가 삭제되었습니다.", "success");
      // Re-fetch AI quiz answers to update the list
      const data = await fetchAIQuizAnswers();
      setAiQuizAnswers(
        data.map((a) => ({
          ...a,
          id: a.quizQuestionId.toString(),
          problemCount: 1,
          selected: false,
        }))
      );
    } catch (err) {
      console.error("Failed to delete quiz question:", err);
      showToast("퀴즈 삭제에 실패했습니다.", "error");
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <S.Layout>
      <S.LeftPanel>
        <S.AverageRateContainer>
          <S.AverageRateValue>{averageCorrectRate}</S.AverageRateValue>
          <S.AverageRateDescription>
            평균 정답률이에요!
          </S.AverageRateDescription>
        </S.AverageRateContainer>

        <FavoritesList items={favoriteItems} onToggleFavorite={handleToggleFavorite} />
        <WrongAnswerList items={wrongAnswerItems} />
      </S.LeftPanel>

      <S.Main>
        <QuizCategorySelect onCategoryChange={setSelectedCategory} />

        <S.ProductSelectionContainer>
          {selectedCategory === "db" ? (
            <>
              <S.ProductGridContainer>
                {products.map((product) => (
                  <SelectObject
                    key={product.id}
                    {...product}
                    onToggle={(id) =>
                      setProducts((prev) =>
                        prev.map((p) =>
                          p.id === id
                            ? { ...p, selected: !p.selected }
                            : { ...p, selected: false } // 다른 것은 모두 선택 해제
                        )
                      )
                    }
                  />
                ))}
              </S.ProductGridContainer>
            </>
          ) : (
            <>
              <SelectCircle
                selected={isAllAISelected}
                label="전체 선택"
                onToggle={() =>
                  setAiQuizAnswers((prev) =>
                    prev.map((a) => ({
                      ...a,
                      selected: !isAllAISelected,
                    }))
                  )
                }
              />

              <S.ProductGridContainer>
                {aiQuizAnswers.map((answer) => (
                  <AIQuizAnswerObject
                    key={answer.id}
                    {...answer}
                    onToggle={(id) =>
                      setAiQuizAnswers((prev) =>
                        prev.map((a) =>
                          a.id === id
                            ? { ...a, selected: !a.selected }
                            : a
                        )
                      )
                    }
                    onDelete={handleDeleteQuizQuestion} // Pass the new handler
                  />
                ))}
              </S.ProductGridContainer>
            </>
          )}
        </S.ProductSelectionContainer>

        <S.CheckboxRow>
          <FavoriteCheckbox
            checked={isFavoriteIncluded}
            onToggle={() => setIsFavoriteIncluded((p) => !p)}
          />
          <WrongAnswerCheckbox
            checked={isWrongAnswerIncluded}
            onToggle={() => setIsWrongAnswerIncluded((p) => !p)}
          />
        </S.CheckboxRow>

          <ProblemDropdown
            value={numberOfProblems}
            onChange={setNumberOfProblems}
            max={getMaxNumberOfProblems()}
        />

        <S.StartQuizButtonWrapper>
          <S.StartQuizButton
            onClick={handleStartQuiz}
            disabled={!isAnySelected}
            $active={isAnySelected}
          >
            퀴즈 시작
          </S.StartQuizButton>
        </S.StartQuizButtonWrapper>
      </S.Main>
    </S.Layout>
  );
};


export default QuizPage;
