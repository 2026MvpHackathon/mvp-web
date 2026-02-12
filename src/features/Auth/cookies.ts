import Cookie from 'js-cookie'

export const getCookie = (name: string): string | null => {
  const cookieValue = Cookie.get(name);
  return cookieValue ?? null
};

export const deleteCookie = (name: string) => {
  Cookie.remove(name);
};

export const setAccessToken = (token: string) => {
  Cookie.set("accessToken", token, {expires: 9999999999999, /* secure: true, */ sameSite: 'Lax'}) // 15분 뒤 만료
}

export const setRefreshToken = (token: string) => {
  Cookie.set("refreshToken", token, {expires: 7, /* secure: true, */ sameSite: 'Lax'}) // 7일 뒤 만료
}

export const setEmail = (email: string) => {
  Cookie.set("email", email, {expires: 7, /* secure: true, */ sameSite: 'Lax'}) // 7일 뒤 만료
}

export const setUserId = (id: string) => {
  Cookie.set("userId", id, {expires: 7, /* secure: true, */ sameSite: 'Lax'}) // 7일 뒤 만료
}

export const isAuthenticated = (): boolean => {
  return Cookie.get("accessToken") !== undefined;
};
