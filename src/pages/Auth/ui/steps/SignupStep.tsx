import AuthInputField from '@/widgets/AuthLayout/ui/AuthInputField';
import * as S from './SignupStep.style'
import { useEffect, useState } from 'react';

const SignupStep = () => {
    const [next, setNext] = useState(false)
    const [password, setPassword] = useState(false)

    useEffect(()=>{
        setNext(true)
        setPassword(true)
    })

    return(
        <>
            {password?
                <AuthInputField 
                    main={'회원가입'} 
                    sub={'회원가입 정보를 입력해주세요'} 
                    inputNames={["비밀번호", "비밀번호 확인"]} 
                    btn={'회원가입'}
                />
            :
                <AuthInputField 
                    main={'회원가입'} 
                    sub={'회원가입 정보를 입력해주세요'} 
                    inputNames={next? ["이메일", "인증코드"] : ["이메일"]} 
                    btn={next? '인증' : '다음'}
                />
            }

        </>

    );
}

export default SignupStep;