import AuthInputField from '@/widgets/Auth/ui/AuthInputField/AuthInputField';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { InputConfig } from '@/widgets/Auth/ui/AuthInputField/AuthInputField';

const SignupStep = () => {
    const navigate = useNavigate();

    const [next, setNext] = useState(false);
    const [passwordStep, setPasswordStep] = useState(false); // Renamed from 'password' to avoid conflict
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [generalError, setGeneralError] = useState('');

    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value);
    }

    function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCode(e.target.value);
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
    }

    function handlePasswordConfirmChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPasswordConfirm(e.target.value);
    }

    function checkEmailHandler() {
        if (!next) {
            // Logic to check email (e.g., API call)
            if (email) { // Simple check for now
                setNext(true);
                setGeneralError('');
            } else {
                setGeneralError('이메일을 입력해 주세요.');
            }
        } else {
            // Logic to verify code (e.g., API call)
            if (code) { // Simple check for now
                setPasswordStep(true);
                setGeneralError('');
            } else {
                setGeneralError('인증코드를 입력해 주세요.');
            }
        }
    }

    function checkPasswordHandler() {
        // Logic to check password and confirm (e.g., API call)
        if (password && password === passwordConfirm) { // Simple check for now
            navigate('/auth/verify');
            setGeneralError('');
        } else {
            setGeneralError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        }
    }

    const INPUT_PASSWORD: InputConfig[] = [
        {name: '비밀번호', placeholder: '비밀번호를 입력해 주세요', fieldName: 'password', type: 'password', value: password, onChange: handlePasswordChange},
        {name: '비밀번호 확인', placeholder: '비밀번호를 한 번 더 입력해 주세요', fieldName: 'passwordConfirm', type: 'password', value: passwordConfirm, onChange: handlePasswordConfirmChange},
    ]

    const INPUT_EMAIL: InputConfig[] = [
        {name: '이메일', placeholder: '이메일 주소를 입력해 주세요', fieldName: 'email', type: 'email', value: email, onChange: handleEmailChange},
        {name: '인증코드', placeholder: '메일로 발송된 인증코드 6자리를 입력해 주세요', fieldName: 'code', type: 'text', value: code, onChange: handleCodeChange},
    ]

    return(
        <>
            {passwordStep ?
                <AuthInputField 
                    main={'회원가입'} 
                    sub={'회원가입 정보를 입력해주세요'} 
                    inputs={INPUT_PASSWORD}
                    btn={'회원가입'}
                    onClick={checkPasswordHandler}
                    generalError={generalError}
                />
            :
                <AuthInputField 
                    main={'회원가입'} 
                    sub={'회원가입 정보를 입력해주세요'} 
                    inputs={next? INPUT_EMAIL : [INPUT_EMAIL[0]]} 
                    btn={next? '인증' : '다음'}
                    onClick={checkEmailHandler}
                    generalError={generalError}
                />
            }

        </>

    );
}

export default SignupStep;