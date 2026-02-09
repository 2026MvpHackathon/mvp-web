import { useEffect, useState } from 'react';

import DuringQuizAccuracyRate from '@/widgets/quiz/ui/DuringQuizAccuracyRate/DuringQuizAccuracyRate';
import DuringQuizOrderItem from '@/widgets/quiz/ui/DuringQuizOrderItem/DuringQuizOrderItem';
import DuringQuizHeader from '@/widgets/quiz/ui/DuringQuizHeader/DuringQuizHeader';
import DuringQuizQuestion from '@/widgets/quiz/ui/DuringQuizQuestion/DuringQuizQuestion';
import DuringQuizChoiceItem from '@/widgets/quiz/ui/DuringQuizChoiceItem/DuringQuizChoiceItem';
import QuizBtn from '@/widgets/quiz/ui/QuizBtn/QuizBtn';

import * as S from './DuringQuiz.style';
import { createQuiz, submitQuizResult } from '@/entities/quiz/api/quiz';
import type { QuizItem, QuizOption } from '@/entities/quiz/types/createQuiz'; // QuizOption 임포트

// QuizItem을 확장하여 UI 상태를 추가한 로컬 타입 정의
type LocalQuizItem = Omit<QuizItem, 'options'> & {
  options: QuizOption[];
  isSubmitted: boolean;
};

const DuringQuizPage = () => {
  const [quizItems, setQuizItems] = useState<LocalQuizItem[]>([]); // 타입 변경
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [showCommentary, setShowCommentary] = useState<boolean>(false);

  const currentQuiz: LocalQuizItem | undefined = quizItems[currentQuizIndex]; // 타입 명시

  // 퀴즈 생성
  const handleCreateQuiz = async () => {
    try {
      const res = await createQuiz({
        quizQuestionIds: [1, 2, 3],
        materialId: 1,
        isFavorite: false,
        isIncorrect: false,
        numberOfQuestions: 3,
      });

      // 각 퀴즈 아이템에 options와 isSubmitted 상태 초기화하여 저장
      const initializedQuizItems: LocalQuizItem[] = res.data.map(item => ({
        ...item,
        options: item.options.map((optionText, index) => ({
          id: index,
          text: optionText,
          state: 'disabled',
        })),
        isSubmitted: false,
      }));
      setQuizItems(initializedQuizItems);
      setCurrentQuizIndex(0);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    handleCreateQuiz();
  }, []);

  useEffect(() => {
    // currentQuiz가 유효할 때만 로직 실행
    if (currentQuiz) {
      // 퀴즈가 제출되었다면 해설을 표시, 아니면 숨김
      setShowCommentary(currentQuiz.isSubmitted);
    } else {
      // currentQuiz가 없을 경우 (예: 초기 로드 시) 해설 숨김
      setShowCommentary(false);
    }
  }, [currentQuizIndex, currentQuiz]); // currentQuiz가 변경될 때도 useEffect가 실행되도록 의존성 추가

  // 선택지 선택
  const handleSelectOption = (optionId: number) => {
    if (!currentQuiz || currentQuiz.isSubmitted) return;

    setQuizItems(prevQuizItems =>
      prevQuizItems.map((item, idx) =>
        idx === currentQuizIndex
          ? {
              ...item,
              options: item.options.map(opt => ({
                ...opt,
                state: opt.id === optionId ? 'selected' : 'disabled',
              })),
            }
          : item
      )
    );
  };

  // 정답 제출 및 해설 표시
  const handleSubmitAnswer = async () => {
    if (!currentQuiz || currentQuiz.isSubmitted) return;

    const answerIndex = currentQuiz.correctAnswerIndex;
    const selectedOption = currentQuiz.options.find(
      opt => opt.state === 'selected'
    );
    const isCorrect = selectedOption?.id === answerIndex;

    // API 제출
    try {
      const submissionPayload = {
        quizQuestionId: currentQuiz.quizQuestionId,
        isCorrect: isCorrect,
        isFavorite: false,
      };
      const submitRes = await submitQuizResult(submissionPayload);
      console.log('Quiz Submission Response:', submitRes);
    } catch (error) {
      console.error('Error submitting quiz result:', error);
    }

    // 퀴즈 아이템 상태 업데이트
    setQuizItems(prevQuizItems =>
      prevQuizItems.map((item, idx) =>
        idx === currentQuizIndex
          ? {
              ...item,
              isSubmitted: true,
              options: item.options.map(opt => {
                if (opt.id === answerIndex) {
                  return { ...opt, state: 'correct' };
                }
                if (selectedOption && opt.id === selectedOption.id && !isCorrect) {
                  return { ...opt, state: 'different' };
                }
                return { ...opt, state: 'disabled' };
              }),
            }
          : item
      )
    );
    setShowCommentary(true); // 해설 표시
  };

  // 이전 퀴즈로 이동
  const handlePreviousQuiz = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(prev => prev - 1);
    }
  };

  // 다음 퀴즈로 이동
  const handleNextQuiz = () => {
    if (currentQuizIndex < quizItems.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      console.log('퀴즈가 끝났습니다.'); // 마지막 퀴즈일 때 메시지 출력
    }
  };

  if (!currentQuiz) return null;

  return (
    <S.container>
      {/* aside */}
      <S.aside_container>
        <DuringQuizAccuracyRate />
        <S.aside_order_wrapper>
          <DuringQuizOrderItem state="disabled" order="1" />
        </S.aside_order_wrapper>
      </S.aside_container>

      {/* main */}
      <S.main_container>
        <DuringQuizHeader
          type="AI"
          rangeText="범위"
          title={`0${currentQuizIndex+1}. 다음 문제에 대한 옳은 답을 사지선다형 보기 중에서 고르시오.`}
        />

        <S.main_content_container>
          <DuringQuizQuestion
            commentary={currentQuiz.aiAnswer}
            showCommentary={showCommentary}
            question={currentQuiz.question}
          />

          <S.main_centent_choice_wrapper>
            {currentQuiz.options.map(option => (
              <DuringQuizChoiceItem
                key={option.id}
                text={option.text}
                state={option.state}
                onClick={() => handleSelectOption(option.id)}
              />
            ))}
          </S.main_centent_choice_wrapper>

          <S.main_content_btn_wrapper>
            {currentQuiz.isSubmitted ? (
              <>
                {currentQuizIndex > 0 && ( // 이전 버튼 조건부 렌더링
                    <QuizBtn text="이전" V1={false} onClick={handlePreviousQuiz} />
                )}
                    <QuizBtn
                        text={currentQuizIndex === quizItems.length - 1 ? "종료" : "다음"}
                        V1={true}
                        onClick={handleNextQuiz}
                    />
              </>
            ) : (
              <QuizBtn text="정답 확인" V1={true} onClick={handleSubmitAnswer} />
            )}
          </S.main_content_btn_wrapper>
        </S.main_content_container>
      </S.main_container>
    </S.container>
  );
};

export default DuringQuizPage;
