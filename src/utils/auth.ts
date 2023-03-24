// 在auth.js中定义设置和获取token的方法
export function getToken(accessOrRefreshKey: "accessToken" | "refreshToken"): string {
	return uni.getStorageSync(accessOrRefreshKey);
}

export function setToken(accessOrRefreshKey: "accessToken" | "refreshToken", value: string) {
	return uni.setStorageSync(accessOrRefreshKey, value);
}
// 获取过期时间，token需要符合JWT格式且有exp属性
export function getExpireInPayload(token: string): number {
	const parts = token.split('.');
  const payload = JSON.parse(atob(parts[1]));
  return Number(payload.exp)
}
