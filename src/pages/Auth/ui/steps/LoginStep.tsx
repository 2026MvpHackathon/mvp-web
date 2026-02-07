import AuthInputField from '@/widgets/AuthLayout/ui/AuthInputField';
import * as S from './LoginStep.style';

const LoginStep = () => {
    const inputName = ["이메일", "비밀번호 확인"]
    return(
        <AuthInputField 
            main={'로그인'} 
            sub={'로그인 정보를 입력해주세요'} 
            inputNames={inputName}
            btn={'로그인'}
        />
    );
}

export default LoginStep;