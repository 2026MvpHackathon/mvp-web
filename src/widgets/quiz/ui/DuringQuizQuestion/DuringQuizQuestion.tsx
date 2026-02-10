import * as S from './DuringQuizQuestion.style';

interface QuizQuestionProps {
    showCommentary: boolean; // onfinishQuiz 대신 showCommentary 사용
    commentary: string;
    question: string;
}

const DuringQuizQuestion = ({showCommentary, commentary, question}: QuizQuestionProps) => {
    return(
        <S.container>
            <S.title>문제</S.title>
            <S.question_wrapper>
                <S.question_text>{question}</S.question_text>
                {showCommentary? // 조건부 렌더링 로직 변경
                    <S.question_commentary>{commentary}</S.question_commentary>
                :""}
            </S.question_wrapper>
        </S.container>
    );
}

export default DuringQuizQuestion;