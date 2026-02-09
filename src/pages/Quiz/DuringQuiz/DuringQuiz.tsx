import { useEffect, useState } from 'react';

import DuringQuizAccuracyRate from '@/widgets/quiz/ui/DuringQuizAccuracyRate/DuringQuizAccuracyRate';
import DuringQuizOrderItem from '@/widgets/quiz/ui/DuringQuizOrderItem/DuringQuizOrderItem';
import DuringQuizHeader from '@/widgets/quiz/ui/DuringQuizHeader/DuringQuizHeader';
import DuringQuizQuestion from '@/widgets/quiz/ui/DuringQuizQuestion/DuringQuizQuestion';
import DuringQuizChoiceItem from '@/widgets/quiz/ui/DuringQuizChoiceItem/DuringQuizChoiceItem';
import QuizBtn from '@/widgets/quiz/ui/QuizBtn/QuizBtn';

import * as S from './DuringQuiz.style';
import { createQuiz } from '@/entities/quiz/api/quiz';
import type { QuizItem } from '@/entities/quiz/types/createQuiz';

export type OptionState =
  | 'disabled'
  | 'selected'
  | 'correct'
  | 'different';

export interface QuizOption {
  id: number;
  text: string;
  state: OptionState;
}

const DuringQuizPage = () => {
  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
  const [options, setOptions] = useState<QuizOption[]>([]);

  const currentQuiz = quizItems[0];

  //퀴즈 선택
  const handleCreateQuiz = async () => {
    try {
      const res = await createQuiz({
        quizQuestionIds: [1, 2, 3],
        materialId: 1,
        isFavorite: false,
        isIncorrect: false,
        numberOfQuestions: 3,
      });

      setQuizItems(res.data);

      const firstQuiz = res.data[0];
      if (!firstQuiz) return;

      // 옵션 string[] → UI 상태 포함 구조로 변환
      setOptions(
        firstQuiz.options.map((text, index) => ({
          id: index,
          text,
          state: 'disabled',
        }))
      );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    handleCreateQuiz();
  }, []);

  // 선택 
  const handleSelectOption = (optionId: number) => {
    setOptions(prev =>
      prev.map(opt => ({
        ...opt,
        state: opt.id === optionId ? 'selected' : 'disabled',
      }))
    );
  };

  // 정답
  const revealAnswer = () => {
    if (!currentQuiz) return;

    const answerIndex = currentQuiz.correctAnswerIndex; 
    const selectedOption = options.find(opt => opt.state === 'selected');

    setOptions(prev =>
      prev.map(opt => {
        if (opt.id === answerIndex) {
          return { ...opt, state: 'correct' };
        }
        if (selectedOption && opt.id === selectedOption.id) {
          return { ...opt, state: 'different' };
        }
        return { ...opt, state: 'disabled' };
      })
    );
  };

  if (!currentQuiz) return null;

  return (
    <S.container>
      {/* aside */}
      <S.aside_container>
        <DuringQuizAccuracyRate />
        <S.aside_order_wrapper>
          <DuringQuizOrderItem state="disable" order="1" />
        </S.aside_order_wrapper>
      </S.aside_container>

      {/* main */}
      <S.main_container>
        <DuringQuizHeader
          type="AI"
          rangeText="범위"
          title="01. 다음 문제에 대한 옳은 답을 사지선다형 보기 중에서 고르시오."
        />

        <S.main_content_container>
          <DuringQuizQuestion
            onfinishQuiz={false}
            commentary={currentQuiz.aiAnswer}
            question={currentQuiz.question}
          />

          <S.main_centent_choice_wrapper>
            {options.map(option => (
              <DuringQuizChoiceItem
                key={option.id}
                text={option.text}
                state={option.state}
                onClick={() => handleSelectOption(option.id)}
              />
            ))}
          </S.main_centent_choice_wrapper>

          <S.main_content_btn_wrapper>
            <QuizBtn
              text="정답 확인"
              V1={true}
              onClick={revealAnswer}
            />
          </S.main_content_btn_wrapper>
        </S.main_content_container>
      </S.main_container>
    </S.container>
  );
};

export default DuringQuizPage;
