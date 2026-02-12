import * as S from './Header.style';
import Logo from '/src/assets/Logo/Logo.png'
import { useLocation, useNavigate } from 'react-router-dom';
import { getCookie, deleteCookie } from '@/features/Auth/cookies';
import axiosInstance from '@/features/Auth/axiosInstance';
import { useToast } from '../Toast/ToastContext';
import { getRecentList } from '@/entities/recent/api/recentApi';




interface ImageResponse {
    path: string;
    size: string;
    alt: string;
    to: string;
}

interface LinkResponse {
    path?: string; // Make path optional
    menu: string;
    active?: boolean;
    onClick?: () => void; // Add onClick handler
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

const Link = ({path, menu, active, onClick}: LinkResponse) => {
    return(
        // Use an anchor tag or a styled div if path is not provided, otherwise use styled_link
        onClick ? (
            <S.header_menu $active={active} onClick={onClick}>{menu}</S.header_menu>
        ) : (
            <S.styled_link to ={path!}>
                <S.header_menu $active={active}>{menu}</S.header_menu>
            </S.styled_link>
        )
    );
}

const Header = ({ isLoggedIn, setIsLoggedIn }: HeaderProps) => { // Destructure props
    const { showToast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthPage = location.pathname.startsWith('/auth');

    const handleLogout = async () => {
        const refreshToken = getCookie("refreshToken");

        if (refreshToken) {
            try {
                await axiosInstance.post(`/api/auth/logout`, { refreshToken });
                showToast('성공적으로 로그아웃되었습니다.', 'success')
            } catch {
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

    const handleStudyClick = async () => {
        try {
            const recentItems = await getRecentList();
            if (recentItems && recentItems.length > 0) {
                const mostRecentMaterialId = recentItems[0].materialId;
                navigate(`/study/${mostRecentMaterialId}`);
            } else {
                // If no recent items, navigate to a default study page or show a message
                showToast('최근 학습한 기계가 없습니다. 기본 학습 페이지로 이동합니다.', 'info');
                navigate('/study'); // Navigate to the default study page
            }
        } catch {
            showToast('최근 학습 목록을 불러오는 데 실패했습니다. 기본 학습 페이지로 이동합니다.', 'error');
            navigate('/study'); // Navigate to the default study page on error
        }
    };

    return(
        <S.header_container>
            <Image path={Logo} size={'104px'} alt={'Logo'} to={'/home'}/>
            <S.header_menu_wrapper>
                <Link path={'/home'} menu={'Home'} active={location.pathname === '/home'}/>
                <Link menu={'Study'} active={location.pathname.startsWith('/study')} onClick={handleStudyClick}/>
                <Link path={'/quiz'} menu={'Quiz'} active={location.pathname.startsWith('/quiz')}/>                                                
            </S.header_menu_wrapper>
            <S.header_btn onClick={isLoggedIn ? handleLogout : handleLoginClick} $isAuthPage={isAuthPage}>
                {isLoggedIn ? '로그아웃' : '로그인'}
            </S.header_btn>
        </S.header_container>
    );
}

export default Header;