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

    return(
        <>
            {password?
                <AuthInputField 
                    main={'회원가입'} 
                    sub={'회원가입 정보를 입력해주세요'} 
                    inputNames={["비밀번호", "비밀번호 확인"]} 
                    btn={'회원가입'}
                    onClick={checkPassword}
                />
            :
                <AuthInputField 
                    main={'회원가입'} 
                    sub={'회원가입 정보를 입력해주세요'} 
                    inputNames={next? ["이메일", "인증코드"] : ["이메일"]} 
                    btn={next? '인증' : '다음'}
                    onClick={checkEmail}
                />
            }

        </>

    );
}

export default SignupStep;