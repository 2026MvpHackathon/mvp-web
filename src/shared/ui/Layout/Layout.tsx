import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import * as S from './Layout.style'

const Layout = () => {
    const location = useLocation();
    const hideHeader = location.pathname.includes('/study/expense');
    return(
        <S.container>
            {!hideHeader && <Header/>}
            <S.body>
                <Outlet/>
            </S.body>
        </S.container>
    );
}

export default Layout;