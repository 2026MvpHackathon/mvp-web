import { loggedInUserRedirect } from '@/features/Auth/authApi';
import AuthInputField from '@/widgets/Auth/ui/AuthInputField/AuthInputField';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from "react-hook-form";
import { setAccessToken, setEmail, setRefreshToken, setUserId } from '@/features/Auth/cookies';
import { publicInstance } from '@/features/Auth/axiosInstance';
import type { InputConfig } from '@/widgets/Auth/ui/AuthInputField/AuthInputField';
import { useAuthStatus } from '@/shared/ui/Layout/Layout'; // Import useAuthStatus
import { useToast } from '@/shared/ui/Toast/ToastContext';



export type LoginInputs = {
  email: string,
  password: string,
}

const LoginStep = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAuthStatus(); // Use the context
    const { showToast } = useToast();

    useEffect(() => {
      loggedInUserRedirect();
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<LoginInputs>()
    

    const [generalError, setGeneralError] = useState("");

    const onSubmit:SubmitHandler<LoginInputs> = (data) => {
      publicInstance.post(`/api/auth/login`, { // Use relative path
        email: data.email,
        password: data.password
      })
      .then(function (response) {
        setAccessToken(response.data.data.accessToken); 
        setRefreshToken(response.data.data.refreshToken); 
        setEmail(response.data.data.email); 
        setUserId(response.data.data.userId)
        setIsLoggedIn(true); // Set isLoggedIn to true after successful login 
        navigate("/home");
        showToast('성공적으로 로그인되었습니다.', 'success');
      })
      .catch(function (error) {
        if (error.response && error.response.status) {
          switch(error.response.status) {
            case (400):
              showToast('이메일 형식이 옮지 않습니다.', 'error');
              setGeneralError("이메일 형식이 옮지 않습니다");
              sessionStorage.clear();

              break;
            case (401):
              showToast('이메일 또는 비밀번호를 확인해 주십시오.', 'error');
              setGeneralError("이메일 또는 비밀번호를 확인해 주십시오.");
              break;
            case (500):
              showToast('서버 에러, 잠시 후 다시 시도해주세요.', 'error');
              break;
            default:
              showToast(`${error.status}, 잠시 후 다시 시도해주세요.`, 'error');
              break;
          }
        } else {
            alert("네트워크 오류가 발생헀습니다. 잠시 후 다시 시도해주세요.");
            showToast(`네트워크 오류가 발생헀습니다. 잠시 후 다시 시도해주세요.`, 'error');
        }
      });
    }


    const INPUT_LOGIN: InputConfig[] = [
        {
          name: '이메일', 
          placeholder: '이메일 주소를 입력해 주세요', 
          fieldName: 'email', 
          type: 'text'
        },
        {
          name: '비밀번호', 
          placeholder: '비밀번호를 입력해 주세요', 
          fieldName: 'password', 
          type: 'password'
        },
    ]

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <AuthInputField<LoginInputs> 
                main={'로그인'} 
                sub={'로그인 정보를 입력해주세요'} 
                inputs={INPUT_LOGIN}
                btn={'로그인'}
                register={register}
                errors={errors}
                generalError={generalError}
            />

        </form>
    );
}

export default LoginStep;


