import AuthInputField from '@/widgets/AuthLayout/ui/AuthInputField';
import { useNavigate } from 'react-router-dom';

const LoginStep = () => {
    const navigate = useNavigate();

    function MoveHandeler() {
        navigate('/auth/select')
    }

    const INPUT_LOGIN = [
        {name: '이메일', placeholder: '이메일 주소를 입력해 주세요'},
        {name: '비밀번호', placeholder: '비밀번호를 입력해 주세요'},
    ]

    return(
        <AuthInputField 
            main={'로그인'} 
            sub={'로그인 정보를 입력해주세요'} 
            inputs={INPUT_LOGIN}
            btn={'로그인'}
            onClick={MoveHandeler}
        />
    );
}

export default LoginStep;