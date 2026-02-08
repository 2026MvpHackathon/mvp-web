import * as S from './DuringQuizOrderItem.style';
import QuizDifferent from '/src/assets/QuizDifferent.png'
import QuizCorrect from '/src/assets/QuizCorrect.png'
import QuizDisable from '/src/assets/QuizDisable.png'

interface ImageResponse {
    path: string;
    size: string; //width 기준
    alt: string;
}

const Image = ({path, size, alt}: ImageResponse) => {
    return(
        <img src={path} width={size} alt={alt}/>
    );
}

const DuringQuizOrderItem = () => {
    return(
        <S.container>
            <Image path={QuizDisable} size={'46px'} alt={''}/>
            <S.text>Question 1</S.text>
        </S.container>
    );
}

export default DuringQuizOrderItem;