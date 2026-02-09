import * as S from './Header.style';
import Logo from '/src/assets/Logo/Logo.png'
import { useLocation, useNavigate } from 'react-router-dom';
import { getCookie, deleteCookie } from '@/features/Auth/cookies';
import axiosInstance from '@/features/Auth/axiosInstance'; // publicInstance를 axiosInstance로 변경
import { useEffect, useState } from 'react';

const SERVER_URL = import.meta.env.VITE_API_URL;

interface ImageResponse {
    path: string;
    size: string;
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
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = () => {
            const accessToken = getCookie("accessToken");
            setIsLoggedIn(!!accessToken);
        };
        checkLoginStatus();

    }, []);

    console.log("Header Rendered in AuthPage context"); // 디버깅용 로그 추가

    const handleLogout = async () => {
        const refreshToken = getCookie("refreshToken");
        console.log("Logout 시도 - RefreshToken:", refreshToken);

        // axiosInstance를 사용하여 Authorization 헤더가 자동으로 포함되도록 함
        if (refreshToken) {
            try {
                const response = await axiosInstance.post(`${SERVER_URL}/api/auth/logout`, { refreshToken });
                console.log("로그아웃 API 응답 (성공):", response); // 성공 응답 전체 로그
                // 200 OK 응답이므로, 이 지점에 도달하면 로그아웃 성공으로 간주
            } catch (error: any) {
                console.error("로그아웃 API 호출 중 오류 발생:", error); // 오류 객체 전체 로그
                alert("로그아웃 처리 중 오류가 발생했습니다. 세션을 확인해주세요.");
            }
        }

        deleteCookie("accessToken"); 
        deleteCookie("refreshToken");
        deleteCookie("email"); 
        deleteCookie("userId");
        setIsLoggedIn(false);
        navigate("/auth/select");
    };

    const handleLoginClick = () => {
        navigate("/auth/select");
    };

    return(
        <S.header_container>
            <Image path={Logo} size={'104px'} alt={'Logo'}/>
            <S.header_menu_wrapper>
                <Link path={'/home'} menu={'Home'} active={location.pathname === '/home'}/>
                <Link path={'/study'} menu={'Study'} active={location.pathname === '/study'}/>
                <Link path={'/quiz'} menu={'Quiz'} active={location.pathname === '/quiz'}/>                                                
            </S.header_menu_wrapper>
            <S.header_btn onClick={isLoggedIn ? handleLogout : handleLoginClick}>
                {isLoggedIn ? '로그아웃' : '로그인'}
            </S.header_btn>
        </S.header_container>
    );
}

export default Header;