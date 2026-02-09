import { Outlet } from 'react-router-dom';
import Header from '@/widgets/header/ui/Header';
import * as S from './Layout.style'
import { useLocation } from 'react-router-dom';


const Layout = () => {
    const location = useLocation();

    return(
        <S.container>
            <Header/>
            <S.body style={location.pathname.startsWith('/auth/') ? {padding: '0px'} : {}}>
                <Outlet/>
            </S.body>
        </S.container>
    );
}

export default Layout;