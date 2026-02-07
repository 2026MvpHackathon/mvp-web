import * as S from './Auth.style'
import AuthGuide from '@/widgets/AuthLayout/ui/AuthGuide';
import LoginStep from './steps/LoginStep';
import SelectLoginOrSignupStep from './steps/SelectLoginOrSignupStep';

const AuthPage = () => {
    return(
        <S.auth_container>
            <S.auth_area>
                <AuthGuide largeText={'large'} smallText={'small'}/>
            </S.auth_area>
            <S.auth_area>
                <SelectLoginOrSignupStep/>
            </S.auth_area>
        </S.auth_container>

    );
}

export default AuthPage;