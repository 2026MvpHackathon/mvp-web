import AuthInputField from '@/widgets/AuthLayout/ui/AuthInputField';
import { useNavigate } from 'react-router-dom';

const LoginStep = () => {
    const inputName = ["이메일", "비밀번호 확인"]
    const navigate = useNavigate();

    function MoveHandeler() {
        navigate('/auth/select')
    }

    return(
        <AuthInputField 
            main={'로그인'} 
            sub={'로그인 정보를 입력해주세요'} 
            inputNames={inputName}
            btn={'로그인'}
            onClick={MoveHandeler}
        />
    );
}

export default LoginStep;