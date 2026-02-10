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
  type ProductItemResponse,
  type AIQuizAnswerItemResponse,
  type StartQuizPayload,
} from "@/shared/api/quiz";

import type { QuizListItem } from "@/entities/quiz-setting/types";
import FavoritesList from "@/entities/quiz-setting/ui/FavoritesList";
import WrongAnswerList from "@/entities/quiz-setting/ui/WrongAnswerList";

interface SelectableProductItem extends ProductItemResponse {
  problemCount: number;
  selected: boolean;
}

interface SelectableAIQuizAnswerItem extends AIQuizAnswerItemResponse {
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
    useState<SelectableAIQuizAnswerItem[]>([]);

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

    const favorites = JSON.parse(
      localStorage.getItem("quiz_favorites") || "[]"
    ) as number[];
    setFavoriteItems(
      favorites.map((id) => ({
        id: id.toString(),
        label: `즐겨찾는 문제 ${id}`,
        category: "db",
      }))
    );

    const wrongs = JSON.parse(
      localStorage.getItem("quiz_wrong_answers") || "[]"
    ) as number[];
    setWrongAnswerItems(
      wrongs.map((id) => ({
        id: id.toString(),
        label: `틀린 문제 ${id}`,
        category: "db",
      }))
    );
  }, []);

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
          const data = await fetchAIQuizAnswers();
          setAiQuizAnswers(
            data.map((a) => ({
              ...a,
              problemCount: a.problemCount ?? 0,
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

  const isAllSelected =
    products.length > 0 && products.every((p) => p.selected);
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

        <FavoritesList items={favoriteItems} />
        <WrongAnswerList items={wrongAnswerItems} />
      </S.LeftPanel>

      <S.Main>
        <QuizCategorySelect onCategoryChange={setSelectedCategory} />

        <S.ProductSelectionContainer>
          {selectedCategory === "db" ? (
            <>
              <SelectCircle
                selected={isAllSelected}
                label="전체 선택"
                onToggle={() => {
                  // DB 카테고리에서는 다중 선택 비활성화
                  showToast("교재는 한 번에 하나만 선택할 수 있습니다.", "info");
                }}
              />

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