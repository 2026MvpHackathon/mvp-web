import * as S from './QuizBtn.style'

interface BtnProps {
    text: string;
    V1: boolean;
    onClick: () => void;
}

const QuizBtn = ({text, V1, onClick}: BtnProps) => {
    return(
        <S.container $V1={V1} onClick={onClick}>
            <S.text>{text}</S.text>
        </S.container>
    );
}

export default QuizBtn;