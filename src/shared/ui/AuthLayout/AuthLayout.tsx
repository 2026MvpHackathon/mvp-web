import * as S from './AuthLayout.style'
import AuthGuide from '@/widgets/Auth/ui/AuthGuide/AuthGuide';
import { Outlet, useLocation } from 'react-router-dom';
import { useMemo } from 'react';

const AuthPage = () => {
    const location = useLocation();
    
    const AUTH_TEXT_MAP: Record<string, {large: string, small: string}> = {
        '/auth/login': {
            large: 'WELCOME', 
            small: 'We’re excited to learn with you!'
        },
        '/auth/select': {
            large: 'Visualize \nAssemble \nUnderstand', 
            small: 'Continue your engineering study'
        },
        'default': {
            large: 'Create \nYour \nAccount', 
            small: '새로 오신 걸 환영해요!'
        }
    };

    const currentText = useMemo(() => {
        return AUTH_TEXT_MAP[location.pathname] || AUTH_TEXT_MAP['default'];
    }, [location.pathname]);

    return(
        <S.container>
            <S.auth_container>
                <S.auth_area_glass_off>
                    <AuthGuide largeText={currentText.large} smallText={currentText.small}/>
                </S.auth_area_glass_off>
                <S.auth_area_glass>
                    <Outlet /> 
                </S.auth_area_glass>
            </S.auth_container>
        </S.container>
    );
}

export default AuthPage;