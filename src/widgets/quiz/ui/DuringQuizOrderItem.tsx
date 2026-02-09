import * as S from './DuringQuizOrderItem.style';
import QuizDifferent from '/src/assets/QuizDifferent.png'
import QuizCorrect from '/src/assets/QuizCorrect.png'
import QuizDisable from '/src/assets/QuizDisable.png'
import { colors } from '@/shared/values/token';

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

interface QuizOrderItemProps {
    state: "disable" | "correct" | "different"
    order: string;
}

const DuringQuizOrderItem = ({state, order}: QuizOrderItemProps) => {
    return(
        <S.container>
            {state==="disable"? <Image path={QuizDisable} size={'46px'} alt={'전'}/>
            :(state==="correct"? <Image path={QuizCorrect} size={'46px'} alt={'옳은'}/>
            :<Image path={QuizDifferent} size={'46px'} alt={'틀린'}/>
            )
            }
            <S.text style={state==="disable"? {color: colors.line.alternative2}:{}}>
                Question {order}
            </S.text>
        </S.container>
    );
}

export default DuringQuizOrderItem;