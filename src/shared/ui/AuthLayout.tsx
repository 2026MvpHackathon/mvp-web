import * as S from './AuthLayout.style'
import AuthGuide from '@/widgets/AuthLayout/ui/AuthGuide';
import { Outlet } from 'react-router-dom';
import { theme } from '@/shared/Theme';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '@/shared/GlobalStyle';
import Header from '@/widgets/header/ui/Header';

const AuthPage = () => {
    
    return(
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Header/>
            <S.auth_container>
                <S.auth_area_glass_off>
                    <AuthGuide largeText={'large'} smallText={'small'}/>
                </S.auth_area_glass_off>
                <S.auth_area_glass>
                    <Outlet /> 
                </S.auth_area_glass>
            </S.auth_container>
        </ThemeProvider>

    );
}

export default AuthPage;