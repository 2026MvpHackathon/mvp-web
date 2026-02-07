import AuthInputField from '@/widgets/AuthLayout/ui/AuthInputField';
import * as S from './Auth.style'
import AuthGuide from '@/widgets/AuthLayout/ui/AuthGuide';

const AuthPage = () => {
    return(
        <S.auth_container>
            <S.auth_area>
                <AuthGuide largeText={'large'} smallText={'small'}/>
            </S.auth_area>
            <S.auth_area>
                <AuthInputField main={''} sub={''} inputName={''}/>
            </S.auth_area>
        </S.auth_container>

    );
}

export default AuthPage;