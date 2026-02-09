import * as S from './QuizBtn.style'

interface BtnProps {
    text: string;
    V1: boolean;
}

const QuizBtn = ({text, V1}: BtnProps) => {
    return(
        <S.container $V1={V1}>
            <S.text>{text}</S.text>
        </S.container>
    );
}

export default QuizBtn;