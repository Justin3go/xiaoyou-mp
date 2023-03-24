import { createSSRApp } from "vue";
import App from "./App.vue";
import { apolloClient } from "./graphql/setup";
import * as Pinia from "pinia";
import { getExpireInPayload, getToken, setToken } from "@/utils/auth"; // auth.js文件用于设置和获取token
import { useMutation } from "villus";
import { refreshTokenGQL } from "@/graphql/me.graphql";
import { useMeStore } from "@/stores/me.store";

export function createApp() {
	const app = createSSRApp(App);
	app.use(apolloClient);
	app.use(Pinia.createPinia());
	return {
		app,
		Pinia, // 此处必须将 Pinia 返回
	};
}

let inRefresh = false;
// 请求拦截器
uni.addInterceptor("request", {
	async invoke(request) {
		const meStore = useMeStore();
		if (meStore.inLogin || inRefresh) return request;

		const timestamp = Math.ceil(+new Date().getTime() / 1000); //获取当前的时间戳

		// 1. access部分
		const accessToken = getToken("accessToken"); // 获取身份验证令牌
		const expInAccessToken = getExpireInPayload(accessToken);
		// accessToken未过期，直接加入请求头请求
		if (timestamp < expInAccessToken) {
			request.header.Authorization = `Bearer ${accessToken}`;
			return request;
		}

		// 2. refresh部分
		const refreshToken = getToken("refreshToken");
		const expInRefreshToken = getExpireInPayload(refreshToken);
		// refreshToken未过期，刷新Token
		if (timestamp < expInRefreshToken) {
			const { execute } = useMutation(refreshTokenGQL);
			inRefresh = true; // 避免递归栈溢出
			const { data, error } = await execute({ token: refreshToken });
			inRefresh = false;
			console.log("refresh data: ", data);
			console.log("refresh error: ", error);
			// save
			const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data?.refreshToken || {};
			request.header.Authorization = `Bearer ${newAccessToken}`;
			setToken("accessToken", newAccessToken);
			setToken("refreshToken", newRefreshToken);
		} else {
			// refreshToken过期，需要重新登录
			uni.switchTab({
				url: "/pages/me/index",
				success: () => {
					uni.showToast({
						title: "登录凭证已失效，请重新登录！",
						icon: "error",
						duration: 2000,
					});
				},
			});
			// TODO 调研直接使用静默登录如何，失效了就重新传入code呗，相当于三层逻辑
			// 但其实好像又没必要，主要是为了让用户跳到me页面查看自己的信息
		}

		return request;
	},
	fail(err) {
		uni.showToast({
			title: `请求错误: ${err}`,
			icon: "error",
			duration: 2000,
		});
	},
	complete() {
		// showLoading需要每次请求前手动添加，因为里面有可自定义的title
		uni.hideLoading();
	},
});
