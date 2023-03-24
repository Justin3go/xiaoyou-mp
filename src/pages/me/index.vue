<template>
	<view class="content">
		<image class="logo" src="/static/logo.jpg" />
		<view class="text-area">
			<text class="title">{{ title }}</text>
			<text class="title">{{ meStore.user?.id }}</text>
		</view>
		<button @click="login">登录</button>
	</view>
</template>

<script setup lang="ts">
import { uniLogin } from "@/apis/uni.api";
import { ref } from "vue";
import { useMeStore } from "@/stores/me.store";

const meStore = useMeStore();

const title = ref("我的");
async function login() {
	const { code } = await uniLogin("weixin");
	meStore.$patch({ inLogin: true }); // 登录时不需要传入JWT
	await meStore.loginAndAutoSignUp(code);
	meStore.$patch({ inLogin: false });
	// TODO 可以检查获取用户信息的nickName及avatarUrl是否为空，从而提示用户补充信息
}
</script>

<style>
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.logo {
	height: 200rpx;
	width: 200rpx;
	margin-top: 200rpx;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 50rpx;
}

.text-area {
	display: flex;
	justify-content: center;
}

.title {
	font-size: 36rpx;
	color: #8f8f94;
}
</style>
