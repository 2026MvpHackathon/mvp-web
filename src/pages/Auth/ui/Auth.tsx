import * as S from './Auth.style'
import AuthGuide from '@/widgets/AuthLayout/ui/AuthGuide';
import LoginStep from './steps/LoginStep';
import SelectLoginOrSignupStep from './steps/SelectLoginOrSignupStep';
import SignupStep from './steps/SignupStep';
import VerifyStep from './steps/VerifyStep';

const AuthPage = () => {
    return(
        <S.auth_container>
            <S.auth_area_glass_off>
                <AuthGuide largeText={'large'} smallText={'small'}/>
            </S.auth_area_glass_off>
            <S.auth_area_glass>
                <VerifyStep/>
            </S.auth_area_glass>
        </S.auth_container>

    );
}

export default AuthPage;