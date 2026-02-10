import { useEffect, useRef, useState } from 'react';

import DuringQuizAccuracyRate from '@/widgets/quiz/ui/DuringQuizAccuracyRate/DuringQuizAccuracyRate';
import DuringQuizOrderItem from '@/widgets/quiz/ui/DuringQuizOrderItem/DuringQuizOrderItem';
import DuringQuizHeader from '@/widgets/quiz/ui/DuringQuizHeader/DuringQuizHeader';
import DuringQuizQuestion from '@/widgets/quiz/ui/DuringQuizQuestion/DuringQuizQuestion';
import DuringQuizChoiceItem from '@/widgets/quiz/ui/DuringQuizChoiceItem/DuringQuizChoiceItem';
import QuizBtn from '@/widgets/quiz/ui/QuizBtn/QuizBtn';

import * as S from './DuringQuiz.style';
import { createQuiz, submitQuizResult } from '@/entities/quiz/api/quiz';
import type { QuizItem, QuizOption } from '@/entities/quiz/types/createQuiz'; 
import { useNavigate, useOutletContext } from 'react-router-dom';

type LayoutContext = {
    setText: (v: string) => void;
    setIsBlur: (v: boolean) => void;
    setLoadingAnimationType: (type: 'none' | 'backAndForth' | 'fillUp') => void;
};

type LocalQuizItem = Omit<QuizItem, 'options'> & {
    options: QuizOption[];
    isSubmitted: boolean;
    isFavorite: boolean;
};

const DuringQuizPage = () => {
    const navigate = useNavigate();
    const [quizItems, setQuizItems] = useState<LocalQuizItem[]>([]); 
    const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
    const [showCommentary, setShowCommentary] = useState<boolean>(false);
    
    // useRef to ensure handleCreateQuiz is called only once
    const hasFetchedQuizRef = useRef(false);
    
    // 정답률 계산을 위한 상태
    // const [totalCorrectAnswers, setTotalCorrectAnswers] = useState<number>(0);
    const [displayAccuracyRate, setDisplayAccuracyRate] = useState<string>("0%");
    const [displayText, setDisplayText] = useState<string>("0 문제 중 0 문제 맞췄어요!");

    const currentQuiz: LocalQuizItem | undefined = quizItems[currentQuizIndex];

    const { setText, setIsBlur, setLoadingAnimationType } = useOutletContext<LayoutContext>();
    // 퀴즈 생성
    const handleCreateQuiz = async () => {
        setText("퀴즈를 생성 중..."); // Set loading text
        setIsBlur(true); // Show blur overlay
        setLoadingAnimationType('backAndForth'); // Set animation type for quiz generation
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
            isFavorite: false, // 즐겨찾기 상태 초기화
        }));
        setQuizItems(initializedQuizItems);
        setCurrentQuizIndex(0);
        } catch (e) {
        console.error(e);
        } finally {
            setIsBlur(false); // Hide blur overlay
            setText(""); // Clear loading text
            setLoadingAnimationType('none'); // Reset animation type
        }
    };

    useEffect(() => {
        if (!hasFetchedQuizRef.current) {
            handleCreateQuiz();
            hasFetchedQuizRef.current = true;
        }
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

    // quizItems가 변경될 때마다 정답률 재계산
    useEffect(() => {
        if (quizItems.length === 0) {
        // setTotalCorrectAnswers(0);
        setDisplayAccuracyRate("0%");
        setDisplayText("0 문제 중 0 문제 맞췄어요!");
        return;
        }

        const totalQuestions = quizItems.length;
        let correctlyAnsweredCount = 0;

        quizItems.forEach(item => {
        if (item.isSubmitted) {
            // 맞힌 문제로 간주하려면, 'correct' 상태인 옵션이 유일하게 존재해야 함
            const hasCorrect = item.options.some(opt => opt.state === 'correct');
            const hasDifferent = item.options.some(opt => opt.state === 'different');

            if (hasCorrect && !hasDifferent) { // 정답을 맞힌 경우
            correctlyAnsweredCount++;
            }
        }
        });

        const currentAccuracyRate = totalQuestions > 0 ? (correctlyAnsweredCount / totalQuestions * 100).toFixed(1) : "0";
        
        // setTotalCorrectAnswers(correctlyAnsweredCount);
        setDisplayAccuracyRate(`${currentAccuracyRate}%`);
        setDisplayText(`${totalQuestions} 문제 중 ${correctlyAnsweredCount} 문제 맞췄어요!`);

    }, [quizItems]); // quizItems 배열이 변경될 때마다 실행

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

        // console.log("handleSubmitAnswer 시작. 현재 퀴즈 상태 (제출 전):", currentQuiz); // 추가

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
            isFavorite: currentQuiz.isFavorite, // 즐겨찾기 상태 반영
        };
        await submitQuizResult(submissionPayload);
        // console.log('Quiz Submission Response:', submitRes);
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
        // console.log("handleSubmitAnswer 완료. setQuizItems 호출됨."); // 추가
        setShowCommentary(true); // 해설 표시
        // console.log("해설 표시 상태 (예상):", true); // showCommentary는 비동기로 업데이트되므로, 예상값을 찍음 // 추가
    };

    // 즐겨찾기 토글 함수
    const handleToggleFavorite = () => {
        if (!currentQuiz) return;


        const nextIsFavorite = !currentQuiz.isFavorite; // 토글될 값 미리 계산

        setQuizItems(prevQuizItems =>
        prevQuizItems.map((item, idx) =>
            idx === currentQuizIndex
            ? {
                ...item,
                isFavorite: nextIsFavorite,
                }
            : item
        )
        );
        // console.log(`퀴즈 ${currentQuizIndex + 1}번 즐겨찾기 상태 변경: ${currentQuiz.isFavorite} -> ${nextIsFavorite}`); // 추가
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
                const numericAccuracyRate = parseFloat(displayAccuracyRate.replace('%', '')).toString();
        setText(numericAccuracyRate);
        setIsBlur(true);
        setLoadingAnimationType('fillUp'); // Set animation type for quiz completion

        setTimeout(() => {
            setText("")
            setIsBlur(false);
            setLoadingAnimationType('none'); // Reset animation type
        }, 6000);

        navigate("/quiz");
        }
    };

    if (!currentQuiz) return null;

    // currentQuestionText는 그대로 유지
    const totalQuizCount = quizItems.length;
    const currentQuestionNumber = currentQuizIndex + 1;
    const currentQuestionText = `${currentQuestionNumber}/${totalQuizCount}`;

    // 제출된 문제 수를 기반으로 progressPercent 계산
    const submittedQuestionsCount = quizItems.filter(item => item.isSubmitted).length;
    const progressPercent = totalQuizCount > 0 ? Math.round((submittedQuestionsCount / totalQuizCount) * 100) : 0;

    return (
        <S.container>
        {/* aside */}
        <S.aside_container>
            <DuringQuizAccuracyRate accuracyRate={displayAccuracyRate} smallText={displayText} />
            <S.aside_order_wrapper>
            {quizItems.map((quizItem, index) => {
                let itemState: "disabled" | "correct" | "different" | "selected" = "disabled";

                if (quizItem.isSubmitted) { // 제출된 퀴즈라면 정답/오답 상태를 우선적으로 적용
                const hasCorrect = quizItem.options.some(opt => opt.state === "correct");
                const hasDifferent = quizItem.options.some(opt => opt.state === "different");

                if (hasCorrect && !hasDifferent) { // 정답을 맞힌 경우
                    itemState = "correct";
                } else if (hasDifferent) { // 정답을 틀린 경우
                    itemState = "different";
                }
                } else if (index === currentQuizIndex) { // 제출되지 않았고 현재 보고 있는 퀴즈라면 selected
                itemState = "selected";
                } else { // 제출되지 않았고 현재 보고 있는 퀴즈도 아님
                itemState = "disabled";
                }
                
                return (
                <DuringQuizOrderItem
                    key={index}
                    state={itemState}
                    order={`${index + 1}`}
                />
                );
            })}
            </S.aside_order_wrapper>
        </S.aside_container>

        {/* main */}
        <S.main_container>
            <DuringQuizHeader
            type="AI"
            rangeText="범위"
            title={`0${currentQuizIndex+1}. 다음 문제에 대한 옳은 답을 사지선다형 보기 중에서 고르시오.`}
            currentQuestionText={currentQuestionText} // 추가
            progressPercent={progressPercent} // 추가
            isFavorite={currentQuiz.isFavorite} // 즐겨찾기 상태 전달
            onToggleFavorite={handleToggleFavorite} // 즐겨찾기 토글 함수 전달
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
                    {currentQuizIndex > 0 && ( 
                        <QuizBtn text="이전" V1={false} onClick={handlePreviousQuiz} />
                    )}
                        <QuizBtn
                            text={currentQuizIndex === quizItems.length - 1 ? "종료" : "다음"}
                            V1={true}
                            onClick={handleNextQuiz}
                        />
                </>
                ) : (
                <QuizBtn text="완료" V1={true} onClick={handleSubmitAnswer} />
                )}
            </S.main_content_btn_wrapper>
            </S.main_content_container>
        </S.main_container>
        </S.container>
    );
};

export default DuringQuizPage;
