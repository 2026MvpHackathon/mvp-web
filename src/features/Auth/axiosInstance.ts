import axios from "axios";
import { getCookie } from "./cookies";
import { logout, tokenRefresh } from "./authApi";


export const publicInstance = axios.create({ //로그인 등 토큰 필요 없는 경우
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// 리프레시 진행 여부와 대기열
let isRefreshing = false;
let failedQueue: any[] = [];

// 대기열 처리 함수
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// 1. Request Interceptor: 토큰이 있으면 그냥 끼워 넣어줌
axiosInstance.interceptors.request.use((config) => {
  const accessToken = getCookie("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config; // Added this line
}, (error) => Promise.reject(error));

// 2. Response Interceptor: 여기가 핵심!
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 재시도한 적이 없는 요청일 때
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 리프레시 중이면 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true; // 재시도 표시
      isRefreshing = true;

      const refreshToken = getCookie("refreshToken");
      const userId = getCookie("userId");

      try {
        const newToken = await tokenRefresh(refreshToken || "", userId || "");
        if (newToken) {
          processQueue(null, newToken); // 대기 중인 요청들 진행
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest); // 현재 실패했던 요청 재시도
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        logout(); // 리프레시 실패 시 로그아웃
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;