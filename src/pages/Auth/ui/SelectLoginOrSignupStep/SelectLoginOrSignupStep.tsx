import AuthBtn from '@/widgets/Auth/ui/AuthBtn/AuthBtn';
import * as S from './SelectLoginOrSignupStep.style'
import { useNavigate } from 'react-router-dom';

interface LoginOrSignupProps {
    guideText: string;
    btnName: string;
    onClick: () => void;
}

const LoginOrSignup = ({guideText, btnName, onClick}: LoginOrSignupProps) => {
    return(
        <S.login_or_signup_wrapper>
            <S.login_or_signup_guide_text>{guideText}</S.login_or_signup_guide_text>
            <AuthBtn radius50={true} name={btnName} onClick={onClick}/>
        </S.login_or_signup_wrapper>
    );
}

const SelectLoginOrSignupStep = () => {
    const navigate = useNavigate();
    
    const TEXT = [
        {guideText: '이미 계정이 있으신가요?', btnName: '로그인', path: '/auth/login'},
        {guideText: 'SIMVEX는 처음이신가요?', btnName: '회원가입', path: '/auth/signup'},
    ]

    return(
        <S.container>
            {TEXT.map((text, index) => (
                <LoginOrSignup key={index} 
                    guideText={text.guideText} 
                    btnName={text.btnName}
                    onClick={() => navigate(text.path)}
                />
            ))}
        </S.container>
    );
}

export default SelectLoginOrSignupStep;