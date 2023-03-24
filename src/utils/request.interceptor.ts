import { getToken, setToken } from "@/utils/auth"; // auth.js文件用于设置和获取token
import { useMutation } from "villus";
import { refreshTokenGQL } from "@/graphql/me.graphql";
import jwt from "jsonwebtoken";
// 请求拦截器
uni.addInterceptor("request", {
	async invoke(request) {
		const timestamp = Math.ceil(+new Date().getTime() / 1000); //获取当前的时间戳

		const accessToken = getToken("accessToken"); // 获取身份验证令牌
		const payloadInAccessToken = jwt.decode(accessToken) as jwt.JwtPayload;
		const expInAccessToken = payloadInAccessToken.exp as number;
		// accessToken未过期，直接加入请求头请求
		if (timestamp < expInAccessToken) {
			request.header.Authorization = `Bearer ${accessToken}`;
			return request;
		}

		const refreshToken = getToken("refreshToken");
		const payloadInRefreshToken = jwt.decode(refreshToken) as jwt.JwtPayload;
		const expInRefreshToken = payloadInRefreshToken.exp as number;
		// refreshToken未过期，刷新Token
		if (timestamp < expInRefreshToken) {
			const { execute } = useMutation(refreshTokenGQL);
			const { data, error } = await execute({ token: refreshToken });
			// refresh失败，重新登录
			if (error) {
				uni.showToast({
					title: "登录凭证已失效，请重新登录！",
					icon: "error",
					duration: 2000,
				});
				uni.navigateTo({
					url: "pages/me",
				});
				return false;
			}
			// save
			const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.value?.refreshToken || {};
			request.header.Authorization = `Bearer ${newAccessToken}`;
			setToken("accessToken", newAccessToken);
			setToken("refreshToken", newRefreshToken);
		}

		return request;
	},
});

export function addInterceptorLog(){
  console.log('添加双token策略拦截器...');
}