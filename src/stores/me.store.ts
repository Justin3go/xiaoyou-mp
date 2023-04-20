import { defineStore } from "pinia";
import type { loginAndAutoSignUpResI, UserInfoI } from "./me.interface";
import { useMutation } from "villus";
import { loginAndAutoSignUpGQL } from "@/graphql/me.graphql";
import { setToken } from '@/utils/auth';

export const useMeStore = defineStore("me", {
	state: () => {
		return {
			user: null as UserInfoI | null,
			inLogin: false, // 是否正在登录
		};
	},
	actions: {
		// 登录自有后端，获取JWT登录态
		async loginAndAutoSignUp(code: string) {
			// TODO 可以检查获取用户信息的nickName及avatarUrl是否为空，从而提示用户补充信息
			const { execute } = useMutation(loginAndAutoSignUpGQL);

			const { data, error } = await execute({ data: { code } });

			if (error) {
				uni.showToast({
					title: `登录失败: ${error}`,
					icon: "error",
					duration: 2000,
				});
				return error;
			}

			const { accessToken, refreshToken, user } = data?.loginAndAutoSignUp || {};
			console.log("loginAndAutoSignUp: ",data);			
			this.user = user;
			setToken('accessToken', accessToken);
			setToken('refreshToken', refreshToken);

			return data as loginAndAutoSignUpResI;
		},
	},
});
