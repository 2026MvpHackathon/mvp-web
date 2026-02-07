import AuthBtn from '@/widgets/AuthLayout/ui/AuthBtn';
import * as S from './SelectLoginOrSignupStep.style'

interface LoginOrSignupProps {
    guideText: string;
    btnName: string;
}

const LoginOrSignup = ({guideText, btnName}: LoginOrSignupProps) => {
    return(
        <S.login_or_signup_wrapper>
            <S.login_or_signup_guide_text>{guideText}</S.login_or_signup_guide_text>
            <AuthBtn radius50={true} name={btnName}/>
        </S.login_or_signup_wrapper>
    );
}

const SelectLoginOrSignupStep = () => {
    const text = [
        {guideText: '이미 계정이 있으신가요?', btnName: '로그인'},
        {guideText: 'SIMVEX는 처음이신가요?', btnName: '회원가입'},
    ]

    return(
        <S.container>
            {text.map((text, index) => (
                <LoginOrSignup key={index} guideText={text.guideText} btnName={text.btnName}/>
            ))}
        </S.container>
    );
}

export default SelectLoginOrSignupStep;