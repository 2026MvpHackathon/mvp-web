import * as S from './AuthLayout.style'
import AuthLayoutGuide from './AuthLayoutGuide';


const AuthLayout = () => {
    return(
        <S.authlayout_container>
            <S.authlayout_guide_area>
                <AuthLayoutGuide largeText={'large'} smallText={'small'}/>
            </S.authlayout_guide_area>
        </S.authlayout_container>
    );
}

export default AuthLayout;