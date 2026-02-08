import AuthInputField from '@/widgets/AuthLayout/ui/AuthInputField';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupStep = () => {
    const navigate = useNavigate();

    const [next, setNext] = useState(false)
    const [password, setPassword] = useState(false)

    function checkEmail() {
        if (!next) setNext(true);
        else setPassword(true);
    }

    function checkPassword() {
        navigate('/auth/verify')
    }

    const INPUT_PASSWORD = [
        {name: '비밀번호', placeholder: '비밀번호를 입력해 주세요'},
        {name: '비밀번호 확인', placeholder: '비밀번호를 한 번 더 입력해 주세요'},
    ]

    const INPUT_EMAIL = [
        {name: '이메일', placeholder: '이메일 주소를 입력해 주세요'},
        {name: '인증코드', placeholder: '메일로 발송된 인증코드 6자리를 입력해 주세요'},
    ]

    return(
        <>
            {password?
                <AuthInputField 
                    main={'회원가입'} 
                    sub={'회원가입 정보를 입력해주세요'} 
                    inputs={INPUT_PASSWORD}
                    btn={'회원가입'}
                    onClick={checkPassword}
                />
            :
                <AuthInputField 
                    main={'회원가입'} 
                    sub={'회원가입 정보를 입력해주세요'} 
                    inputs={next? INPUT_EMAIL : [INPUT_EMAIL[0]]} 
                    btn={next? '인증' : '다음'}
                    onClick={checkEmail}
                />
            }

        </>

    );
}

export default SignupStep;