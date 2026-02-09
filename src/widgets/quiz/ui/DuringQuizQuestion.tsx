import * as S from './DuringQuizQuestion.style';

interface QuizQuestionProps {
    onfinishQuiz: boolean;
    commentary: string;
    question: string;
}

const DuringQuizQuestion = ({onfinishQuiz, commentary, question}: QuizQuestionProps) => {
    return(
        <S.container>
            <S.title>문제</S.title>
            <S.question_wrapper>
                <S.question_text>{question}</S.question_text>
                {onfinishQuiz? 
                    <S.question_commentary>{commentary}</S.question_commentary>
                :""}
            </S.question_wrapper>
        </S.container>
    );
}

export default DuringQuizQuestion;