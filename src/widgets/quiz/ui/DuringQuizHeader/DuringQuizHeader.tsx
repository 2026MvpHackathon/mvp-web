import QuizAI from '@/assets/icons/Quiz/QuizAI';
import * as S from './DuringQuizHeader.style';
import { colors } from '@/shared/values/token';
import QuizDB from '@/assets/icons/Quiz/QuizDB';
import QuizFavoritesOn from '@/assets/icons/Quiz/QuizFavoritesOn';
import QuizFavoritesOff from '@/assets/icons/Quiz/QuizFavoritesOff';

interface QuizHeader {
    type: "AI" | "DB";
    rangeText: string;
    isActive?: boolean;
    title: string;
    currentQuestion?: number; 
    totalQuestions?: number; 
}

const DuringQuizHeader = ({
    type, 
    rangeText, 
    isActive, 
    title,
    currentQuestion = 8,  // test
    totalQuestions = 10   // 기본값
}: QuizHeader) => {
    const progress = Math.round((currentQuestion / totalQuestions) * 100);

    return(
        <S.header_container>
            <S.header_top_container>
                <S.header_top_front_wrapper>
                    {type === "AI"? 
                        <QuizAI color={colors.text.strong}/>: 
                        <QuizDB color={colors.text.strong}/>}
                    <S.header_top_range_text>{rangeText}</S.header_top_range_text>
                </S.header_top_front_wrapper>
                {isActive? <QuizFavoritesOn/>: <QuizFavoritesOff/>}
            </S.header_top_container>

            <S.header_Quiz_title>{title}</S.header_Quiz_title>

            <S.header_bottom_container>
                <S.ProgressBarWrapper>
                    <S.ProgressBarBackground />
                    <S.ProgressBarFill progress={progress} />
                </S.ProgressBarWrapper>
                <S.header_bottom_progress_percent_wrapper>
                    <S.header_bottom_progress_percent_numb>{progress}</S.header_bottom_progress_percent_numb>
                    <S.header_bottom_progress_percent>%</S.header_bottom_progress_percent>
                </S.header_bottom_progress_percent_wrapper>
            </S.header_bottom_container>
        </S.header_container>
    );
}

export default DuringQuizHeader;