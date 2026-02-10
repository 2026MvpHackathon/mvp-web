import Cookie from 'js-cookie'

export const getCookie = (name: string): string | null => {
  const cookieValue = Cookie.get(name);
  // console.log("Getting cookie", name + ":", cookieValue); 
  return cookieValue ?? null
};

export const deleteCookie = (name: string) => {
  // console.log("Deleting cookie:", name); 
  Cookie.remove(name);
};

export const setAccessToken = (token: string) => {
  // console.log("Setting accessToken:", token); 
  Cookie.set("accessToken", token, {expires: 9999999999999, /* secure: true, */ sameSite: 'Lax'}) // 15분 뒤 만료
}

export const setRefreshToken = (token: string) => {
  // console.log("Setting refreshToken:", token); 
  Cookie.set("refreshToken", token, {expires: 7, /* secure: true, */ sameSite: 'Lax'}) // 7일 뒤 만료
}

export const setEmail = (email: string) => {
  // console.log("Setting email:", email); 
  Cookie.set("email", email, {expires: 7, /* secure: true, */ sameSite: 'Lax'}) // 7일 뒤 만료
}

export const setUserId = (id: string) => {
  // console.log("Setting userId:", id); 
  Cookie.set("userId", id, {expires: 7, /* secure: true, */ sameSite: 'Lax'}) // 7일 뒤 만료
}

export const isAuthenticated = (): boolean => {
  return Cookie.get("accessToken") !== undefined;
};
