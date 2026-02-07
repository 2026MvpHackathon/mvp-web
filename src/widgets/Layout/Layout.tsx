import { Outlet } from 'react-router-dom';
import Header from '../header/ui/Header';
import * as S from './Layout.style'

const Layout = () => {
    return(
        <S.container>
            <Header/>
            <S.body>
                <Outlet/>
            </S.body>
        </S.container>
    );
}

export default Layout;