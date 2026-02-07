import * as S from './AuthLayoutGuide.style'


interface GuideTextResponse {
    largeText: string;
    smallText: string;
}

const AuthLayoutGuide = ({largeText, smallText}: GuideTextResponse) => {
    return(
        <S.guide_wrapper>
            <S.guide_large_text>{largeText}</S.guide_large_text>
            <S.guide_small_text>{smallText}</S.guide_small_text>
        </S.guide_wrapper>
    );
}

export default AuthLayoutGuide;