import * as S from './Header.style';
import Logo from '/src/assets/Logo/Logo.png'
import { useLocation, useNavigate } from 'react-router-dom';
import { getCookie, deleteCookie } from '@/features/Auth/cookies';
import axiosInstance from '@/features/Auth/axiosInstance';
import { useToast } from '../Toast/ToastContext';




interface ImageResponse {
    path: string;
    size: string;
    alt: string;
    to: string;
}

interface LinkResponse {
    path: string;
    menu: string;
    active?: boolean;
}

// Added HeaderProps interface
interface HeaderProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (loggedIn: boolean) => void;
}

const Image = ({path, size, alt, to}: ImageResponse) => {
    return(
        <S.styled_link to={to}><img src={path} width={size} alt={alt}/></S.styled_link>
    );
}

const Link = ({path, menu, active}: LinkResponse) => {
    return(
        <S.styled_link to ={path}>
            <S.header_menu $active={active}>{menu}</S.header_menu>
        </S.styled_link>
    );
}

const Header = ({ isLoggedIn, setIsLoggedIn }: HeaderProps) => { // Destructure props
    const { showToast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthPage = location.pathname.startsWith('/auth');

    // console.log("Header Rendered in AuthPage context"); // 디버깅용 로그 추가

    const handleLogout = async () => {
        const refreshToken = getCookie("refreshToken");
        // console.log("Logout 시도 - RefreshToken:", refreshToken);

        if (refreshToken) {
            try {
                await axiosInstance.post(`/api/auth/logout`, { refreshToken }); // Use relative path
                showToast('성공적으로 로그아웃되었습니다..', 'success')
                // console.log("로그아웃 API 응답 (성공):", response);
            } catch (error: any) {
                console.error("로그아웃 API 호출 중 오류 발생:", error);
                showToast('로그아웃 처리 중 오류가 발생했습니다.', 'error')
                
                
            }
        }
        
        deleteCookie("accessToken"); 
        deleteCookie("refreshToken");
        deleteCookie("email"); 
        deleteCookie("userId");
        setIsLoggedIn(false); // Use prop's setIsLoggedIn
        navigate("/auth/select");
    };

    const handleLoginClick = () => {
        navigate("/auth/select");
    };

    return(
        <S.header_container>
            <Image path={Logo} size={'104px'} alt={'Logo'} to={'/home'}/>
            <S.header_menu_wrapper>
                <Link path={'/home'} menu={'Home'} active={location.pathname === '/home'}/>
                <Link path={'/study'} menu={'Study'} active={location.pathname === '/study'}/>
                <Link path={'/quiz'} menu={'Quiz'} active={location.pathname.startsWith('/quiz')}/>                                                
            </S.header_menu_wrapper>
            <S.header_btn onClick={isLoggedIn ? handleLogout : handleLoginClick} isAuthPage={isAuthPage}>
                {isLoggedIn ? '로그아웃' : '로그인'}
            </S.header_btn>
        </S.header_container>
    );
}

export default Header;