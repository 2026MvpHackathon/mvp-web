import AuthInputField from '@/widgets/Auth/ui/AuthInputField/AuthInputField';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { InputConfig } from '@/widgets/Auth/ui/AuthInputField/AuthInputField';
import { publicInstance } from '@/features/Auth/axiosInstance'; 
import { useToast } from '@/shared/ui/Toast/ToastContext';



const SignupStep = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [next, setNext] = useState(false);
    const [passwordStep, setPasswordStep] = useState(false);
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

    async function checkEmailHandler() {
        setGeneralError(''); // 에러 메시지 초기화

        if (!next) {
            // 이메일 발송 단계
            if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
                showToast('유효한 이메일 주소를 입력해 주세요.', 'error')
                setGeneralError('유효한 이메일 주소를 입력해 주세요.');
                return;
            }
            try {
                await publicInstance.post(`/api/auth/email/send`, { email }); // Use relative path
                showToast('인증코드 6자리를 입력해주세요.', 'info')
                setNext(true); // 인증코드 입력 단계로 이동
            } catch (error: any) {
                setGeneralError(error.response?.data?.message || '이메일 발송에 실패했습니다.');
                showToast('이메일 발송에 실패했습니다.', 'error')
            }
        } else {
            // 인증 코드 확인 단계
            if (!code || code.length !== 6) {
                setGeneralError('6자리 인증코드를 입력해 주세요.');
                showToast('6자리 인증코드를 입력해 주세요.', 'error')
                return;
            }
            try {
                await publicInstance.post(`/api/auth/email/verify`, { email, code }); // Use relative path
                setPasswordStep(true); // 비밀번호 설정 단계로 이동
                showToast('인증되었습니다.', 'success')
            } catch (error: any) {
                setGeneralError(error.response?.data?.message || '인증코드 확인에 실패했습니다.');
                showToast('인증코드 확인에 실패했습니다.', 'error')
            }
        }
    }

    async function checkPasswordHandler() {
        setGeneralError(''); // 에러 메시지 초기화

        if (!password || password.length < 4) {
            setGeneralError('비밀번호는 4자 이상이어야 합니다.');
            showToast('비밀번호는 4자 이상이어야 합니다.', 'error')
            return;
        }
        if (password !== passwordConfirm) {
            setGeneralError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            showToast('비밀번호와 비밀번호 확인이 일치하지 않습니다.', 'error')
            return;
        }

        try {
            // 회원가입 API 호출
            await publicInstance.post(`/api/auth/signup`, { email, password }); // Use relative path
            navigate('/auth/verify'); // 회원가입 성공 후 이동
        } catch (error: any) {
            setGeneralError(error.response?.data?.message || '회원가입에 실패했습니다.');
            showToast('회원가입에 실패했습니다.', 'error')
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
                <AuthInputField<Record<string, any>> 
                    main={'회원가입'} 
                    sub={'회원가입 정보를 입력해주세요'} 
                    inputs={INPUT_PASSWORD}
                    btn={'회원가입'}
                    onClick={checkPasswordHandler}
                    generalError={generalError}
                />
            :
                <AuthInputField<Record<string, any>> 
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