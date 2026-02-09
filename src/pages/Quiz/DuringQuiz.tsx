import DuringQuizAccuracyRate from '@/widgets/quiz/ui/DuringQuizAccuracyRate';
import * as S from './DuringQuiz.style';
import DuringQuizOrderItem from '@/widgets/quiz/ui/DuringQuizOrderItem';
import DuringQuizHeader from '@/widgets/quiz/ui/DuringQuizHeader';
import DuringQuizQuestion from '@/widgets/quiz/ui/DuringQuizQuestion';
import DuringQuizChoiceItem from '@/widgets/quiz/ui/DuringQuizChoiceItem';
import QuizBtn from '@/widgets/quiz/ui/QuizBtn';

const DuringQuizPage = () => {
    return(
        <S.container>
            <S.aside_container>
                <DuringQuizAccuracyRate/>
                <S.aside_order_wrapper>
                    <DuringQuizOrderItem state={'disable'} order={'1'}/>
                </S.aside_order_wrapper>
            </S.aside_container>
            <S.main_container>
                <DuringQuizHeader type={'AI'} rangeText={'범위'} title={'01. Quiz'}/>
                <S.main_content_container>
                    <DuringQuizQuestion onfinishQuiz={false} commentary={'해설'} question={'퀴즈'}/>
                    <S.main_centent_choice_wrapper>
                        <DuringQuizChoiceItem text={'선택지'} state={'disable'}/>
                    </S.main_centent_choice_wrapper>
                    <S.main_content_btn_wrapper>
                        <QuizBtn text={'Btn'} V1={true}/>
                    </S.main_content_btn_wrapper>
                </S.main_content_container>
            </S.main_container>
        </S.container>
    );
}

export default DuringQuizPage;