import * as S from './DuringQuizAccuracyRate.style';

const DuringQuizAccuracyRate = () => {

    const accuracyRate = {
        accuracyRate: '66.7%',
        smallText: '3 문제 중 2 문제 맞췄어요!'
    }

    return(
        <S.container>
            <S.accuracy_rate>{accuracyRate.accuracyRate}</S.accuracy_rate>
            <S.small_text>{accuracyRate.smallText}</S.small_text>
        </S.container>
    );
}

export default DuringQuizAccuracyRate;