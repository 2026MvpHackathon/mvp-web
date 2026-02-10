import * as S from './DuringQuizAccuracyRate.style';

interface DuringQuizAccuracyRateProps {
    accuracyRate: string;
    smallText: string;
}

const DuringQuizAccuracyRate = ({ accuracyRate, smallText }: DuringQuizAccuracyRateProps) => {
    return(
        <S.container>
            <S.accuracy_rate>{accuracyRate}</S.accuracy_rate>
            <S.small_text>{smallText}</S.small_text>
        </S.container>
    );
}

export default DuringQuizAccuracyRate;