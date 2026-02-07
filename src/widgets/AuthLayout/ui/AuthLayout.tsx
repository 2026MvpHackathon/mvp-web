import * as S from './AuthLayout.style'
import AuthLayoutGuide from './AuthLayoutGuide';
import AuthLayoutInputField from './AuthLayoutInputField';


const AuthLayout = () => {
    return(
        <S.authlayout_container>
            <S.authlayout_area>
                <AuthLayoutGuide largeText={'large'} smallText={'small'}/>
            </S.authlayout_area>
            <S.authlayout_area>
                <AuthLayoutInputField/>
            </S.authlayout_area>
        </S.authlayout_container>
    );
}

export default AuthLayout;