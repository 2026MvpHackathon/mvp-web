import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import DuringQuizAccuracyRate from "@/widgets/quiz/ui/DuringQuizAccuracyRate/DuringQuizAccuracyRate";
import DuringQuizOrderItem from "@/widgets/quiz/ui/DuringQuizOrderItem/DuringQuizOrderItem";
import DuringQuizHeader from "@/widgets/quiz/ui/DuringQuizHeader/DuringQuizHeader";
import DuringQuizQuestion from "@/widgets/quiz/ui/DuringQuizQuestion/DuringQuizQuestion";
import DuringQuizChoiceItem from "@/widgets/quiz/ui/DuringQuizChoiceItem/DuringQuizChoiceItem";
import QuizBtn from "@/widgets/quiz/ui/QuizBtn/QuizBtn";

import * as S from "./DuringQuiz.style";
import { createQuiz, submitQuizResult } from "@/entities/quiz/api/quiz";
import type { QuizItem, QuizOption, QuizRequest } from "@/entities/quiz/types/createQuiz";
import type { StartQuizPayload } from "@/shared/api/quiz";

type LayoutContext = {
  setText: (v: string) => void;
  setIsBlur: (v: boolean) => void;
  setLoadingAnimationType: (type: "none" | "backAndForth" | "fillUp") => void;
};

type LocalQuizItem = Omit<QuizItem, "options"> & {
  options: QuizOption[];
  isSubmitted: boolean;
  isFavorite: boolean;
  selectedOptionId?: number;
  isCorrect?: boolean;
};

const DuringQuizPage = () => {
  const navigate = useNavigate();
  const { setText, setIsBlur, setLoadingAnimationType } =
    useOutletContext<LayoutContext>();

  const [quizItems, setQuizItems] = useState<LocalQuizItem[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [showCommentary, setShowCommentary] = useState(false);

  const [displayAccuracyRate, setDisplayAccuracyRate] = useState("0%");
  const [displayText, setDisplayText] = useState("0 문제 중 0 문제 맞췄어요!");

  const hasFetchedQuizRef = useRef(false);
  const currentQuiz = quizItems[currentQuizIndex];

  /** 퀴즈 생성 */
  const handleCreateQuiz = useCallback(async () => {
    setText("퀴즈를 생성 중...");
    setIsBlur(true);
    setLoadingAnimationType("backAndForth");

    try {
      const stored = localStorage.getItem("quizSettings");
      if (!stored) {
        navigate("/quiz");
        return;
      }

      const settings = JSON.parse(stored) as StartQuizPayload;
      localStorage.removeItem("quizSettings");

      const payload: QuizRequest =
        settings.category === "db"
          ? {
              quizQuestionIds: [],
              materialId: Number(settings.productIds[0]),
              isFavorite: settings.isFavoriteIncluded,
              isIncorrect: settings.isWrongAnswerIncluded,
              numberOfQuestions: settings.numberOfProblems,
            }
          : {
              quizQuestionIds: settings.aiAnswerIds.map(Number),
              materialId: 0,
              isFavorite: settings.isFavoriteIncluded,
              isIncorrect: settings.isWrongAnswerIncluded,
              numberOfQuestions: settings.numberOfProblems,
            };

      const res = await createQuiz(payload);
      const quizList: QuizItem[] = res?.quizzes ?? res?.data?.quizzes ?? [];

      setQuizItems(
        quizList.map((q) => ({
          ...q,
          options: q.options.map((text, idx) => ({
            id: idx,
            text,
            state: "disabled",
          })),
          isSubmitted: false,
          isFavorite: false,
        }))
      );
    } finally {
      setIsBlur(false);
      setText("");
      setLoadingAnimationType("none");
    }
  }, [navigate, setIsBlur, setLoadingAnimationType, setText]);

  useEffect(() => {
    if (!hasFetchedQuizRef.current) {
      handleCreateQuiz();
      hasFetchedQuizRef.current = true;
    }
  }, [handleCreateQuiz]);

  useEffect(() => {
    if (!currentQuiz) return;
    setShowCommentary(currentQuiz.isSubmitted);
  }, [currentQuiz]);

  /** 정답률 계산 */
  useEffect(() => {
    const total = quizItems.length;
    const correct = quizItems.filter((q) => q.isSubmitted && q.isCorrect).length;

    const rate = total === 0 ? 0 : Math.round((correct / total) * 100);
    setDisplayAccuracyRate(`${rate}%`);
    setDisplayText(`${total} 문제 중 ${correct} 문제 맞췄어요!`);
  }, [quizItems]);

  /** 선택 */
  const handleSelectOption = (optionId: number) => {
    if (!currentQuiz || currentQuiz.isSubmitted) return;

    setQuizItems((prev) =>
      prev.map((q, idx) =>
        idx === currentQuizIndex
          ? {
              ...q,
              selectedOptionId: optionId,
              options: q.options.map((o) => ({
                ...o,
                state: o.id === optionId ? "selected" : "disabled",
              })),
            }
          : q
      )
    );
  };

  /** 제출 */
  const handleSubmitAnswer = async () => {
    if (!currentQuiz || currentQuiz.isSubmitted) return;

    const selectedId = currentQuiz.selectedOptionId;
    const isCorrect = selectedId === currentQuiz.correctAnswerIndex;

    try {
      await submitQuizResult({
        quizQuestionId: currentQuiz.quizQuestionId,
        isCorrect,
        isFavorite: currentQuiz.isFavorite,
      });
    } catch {}

    setQuizItems((prev) =>
      prev.map((q, idx) =>
        idx === currentQuizIndex
          ? {
              ...q,
              isSubmitted: true,
              isCorrect,
              options: q.options.map((o) => {
                if (o.id === q.correctAnswerIndex)
                  return { ...o, state: "correct" };
                if (o.id === selectedId && !isCorrect)
                  return { ...o, state: "different" };
                return { ...o, state: "disabled" };
              }),
            }
          : q
      )
    );
  };

  /** 다음 / 종료 */
  const handleNextQuiz = () => {
    if (currentQuizIndex < quizItems.length - 1) {
      setCurrentQuizIndex((p) => p + 1);
      return;
    }

    const total = quizItems.length;
    const correct = quizItems.filter((q) => q.isCorrect).length;
    const finalRate = total === 0 ? 0 : Math.round((correct / total) * 100);

    // 평균 정답률 저장
    const prev = Number(localStorage.getItem("averageQuizAccuracy"));
    const newAvg = isNaN(prev)
      ? finalRate
      : Math.round((prev + finalRate) / 2);

    localStorage.setItem("averageQuizAccuracy", String(newAvg));

    setText(String(finalRate));
    setIsBlur(true);
    setLoadingAnimationType("fillUp");

    setTimeout(() => {
      setIsBlur(false);
      setText("");
      setLoadingAnimationType("none");
      navigate("/quiz");
    }, 6000);
  };

  if (!currentQuiz) return null;

  const submittedCount = quizItems.filter((q) => q.isSubmitted).length;
  const progressPercent = Math.round(
    (submittedCount / quizItems.length) * 100
  );

  return (
    <S.container>
      <S.aside_container>
        <DuringQuizAccuracyRate
          accuracyRate={displayAccuracyRate}
          smallText={displayText}
        />

        <S.aside_order_wrapper>
          {quizItems.map((q, i) => (
            <DuringQuizOrderItem
              key={i}
              order={`${i + 1}`}
              state={
                q.isSubmitted
                  ? q.isCorrect
                    ? "correct"
                    : "different"
                  : i === currentQuizIndex
                  ? "selected"
                  : "disabled"
              }
            />
          ))}
        </S.aside_order_wrapper>
      </S.aside_container>

      <S.main_container>
        <DuringQuizHeader
          type="AI"
          rangeText="범위"
          title={`0${currentQuizIndex + 1}. 다음 문제의 정답을 고르시오.`}
          currentQuestionText={`${currentQuizIndex + 1}/${quizItems.length}`}
          progressPercent={progressPercent}
          isFavorite={currentQuiz.isFavorite}
          onToggleFavorite={() => {}}
        />

        <S.main_content_container>
          <DuringQuizQuestion
            question={currentQuiz.question}
            commentary={currentQuiz.aiAnswer}
            showCommentary={showCommentary}
          />

          <S.main_centent_choice_wrapper>
            {currentQuiz.options.map((o) => (
              <DuringQuizChoiceItem
                key={o.id}
                text={o.text}
                state={o.state}
                onClick={() => handleSelectOption(o.id)}
              />
            ))}
          </S.main_centent_choice_wrapper>

          <S.main_content_btn_wrapper>
            <QuizBtn
              text={
                currentQuiz.isSubmitted
                  ? currentQuizIndex === quizItems.length - 1
                    ? "종료"
                    : "다음"
                  : "완료"
              }
              V1
              onClick={
                currentQuiz.isSubmitted
                  ? handleNextQuiz
                  : handleSubmitAnswer
              }
            />
          </S.main_content_btn_wrapper>
        </S.main_content_container>
      </S.main_container>
    </S.container>
  );
};

export default DuringQuizPage;
