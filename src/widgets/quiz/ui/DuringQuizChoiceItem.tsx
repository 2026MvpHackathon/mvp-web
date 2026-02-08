import * as S from './DuringQuizChoiceItem.style';
import QuizWrongAnswer from '/src/assets/QuizWrongAnswer.png'
import QuizCorrectAnswer from '/src/assets/QuizCorrectAnswer.png'


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

interface ChoiceItem {
    text: string;
    state: "correct" | "different" | "disable";
}

const DuringQuizChoiceItem = ({text, state}: ChoiceItem) => {
    return(
        <S.container $state={state}>
            <S.text $state={state}>{text}</S.text>
    
            {(state === "correct")?
             <Image path={QuizCorrectAnswer} size={'22px'} alt={'정답'}/>
            :(state === "different")?
            <Image path={QuizWrongAnswer} size={'22px'} alt={'오답'}/>
            : ""}
        </S.container>
    );
}

export default DuringQuizChoiceItem;