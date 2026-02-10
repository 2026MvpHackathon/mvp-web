import { deleteCookie, getCookie, setAccessToken, setRefreshToken } from "./cookies"; 
import { publicInstance } from "./axiosInstance";

export const tokenRefresh = async (token: string, userId: string) => {
  try {
    const response = await publicInstance.post(`/api/auth/refresh`, { 
      userId: userId,
      refreshToken: token
    })

    const newToken = response.data.data.accessToken; // 수정된 경로
    setAccessToken(newToken);

    // 백엔드가 새로운 refreshToken을 보낼 경우 업데이트
    if (response.data.data.refreshToken) { // 수정된 경로
      setRefreshToken(response.data.data.refreshToken); // 수정된 경로
    }

    return newToken
  }
  catch { //발급 실패 시 로그인페이지로 이동
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    deleteCookie("userId")
    deleteCookie("email")
    console.log('토큰이 만료되었습니다.'); // Added console log
    window.location.replace("/auth/login"); // Changed from /auth/select
    return null;
  }
}

export const checkLogin = async () => {
  const accessToken = getCookie("accessToken");
  const refreshToken = getCookie("refreshToken");
  const userId = getCookie("userId");

  if (accessToken) {
    return true;
  } else {
    if (refreshToken && userId) {
      const newToken = await tokenRefresh(refreshToken, userId)
      if (newToken) {
        return true;
      }
    }
    return false;
  }
}

export async function loggedInUserRedirect() {
  const isLoggedIn = await checkLogin();
  if (isLoggedIn) {
    window.location.replace("/");
  }
}

export const logout = () => {
  deleteCookie("accessToken");
  deleteCookie("refreshToken");
  deleteCookie("email")
  deleteCookie("userId")
  console.log('토큰이 만료되었습니다.'); // Added console log
  window.location.replace("/auth/login"); // Changed from /auth/select
}