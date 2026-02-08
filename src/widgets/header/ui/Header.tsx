import * as S from './Header.style';
import Logo from '/src/assets/Logo.png'
import { useLocation } from 'react-router-dom';

interface ImageResponse {
    path: string;
    size: string; //width 기준
    alt: string;
}

interface LinkResponse {
    path: string;
    menu: string;
    active?: boolean;
}

const Image = ({path, size, alt}: ImageResponse) => {
    return(
        <img src={path} width={size} alt={alt}/>
    );
}

const Link = ({path, menu, active}: LinkResponse) => {
    return(
        <S.styled_link to ={path}>
            <S.header_menu $active={active}>{menu}</S.header_menu>
        </S.styled_link>
    );
}

const Header = () => {
    const location = useLocation();

    return(
        <S.header_container>
            <Image path={Logo} size={'104px'} alt={'Logo'}/>
            <S.header_menu_wrapper>
                <Link path={'/home'} menu={'Home'} active={location.pathname === '/home'}/>
                <Link path={'/study'} menu={'Study'} active={location.pathname === '/study'}/>
                <Link path={'/quiz'} menu={'Quiz'} active={location.pathname === '/quiz'}/>                                                
            </S.header_menu_wrapper>
            <S.header_btn>로그아웃</S.header_btn>
        </S.header_container>
    );
}

export default Header;