<template>
	<view v-if="!isLogin" class="no-login">
		<view class="logo">
			<image style="height: 250px; border-radius: 50px" mode="heightFix" :src="logoUrl"></image>
		</view>
		<view class="tips">
			<view class="tips-title">用户登录注意事项</view>
			<view class="tips-content"
				>1. 未注册的用户将直接注册，第一次使用该小程序的用户请登录后及时补充完整的昵称、头像等关键信息；</view
			>
			<view class="tips-content"
				>2. 请使用你常用的昵称或者真实姓名和头像，以方便在互相填写问卷时识别是谁帮助了你以及你帮助了谁；</view
			>
			<view class="tips-content">3. 性别、城市、年龄等信息也是我们后续提供相关心理服务的重要依据。</view>
		</view>
		<view class="login-button-container">
			<button @click="login" class="login-button">一键登录/注册</button>
		</view>
	</view>
	<view v-if="isLogin" class="me-container">
		<view class="top-card">
			<view class="user-info">
				<view class="info">
					<image
						class="avatar"
						style="height: 90%; border-radius: 50%"
						mode="heightFix"
						:src="meStore.user?.avatarUrl || userDefaultData.avatarUrl"
					></image>
					<view class="text-info">
						<view class="nick-name">{{ meStore.user?.nickName || userDefaultData.nickName }}</view>
						<view class="id">id: {{ meStore.user?.id || userDefaultData.id }}</view>
					</view>
				</view>
				<view class="icon" @click="toUpdateUser">
					<uni-icons type="forward" size="30" color="#D3D3D3"></uni-icons>
				</view>
				<view class="update-user-entry"></view>
			</view>
			<view class="quick-entry">
				<quick-entry-card></quick-entry-card>
				<quick-entry-card></quick-entry-card>
			</view>
		</view>
		<view class="service-card">
			<view class="title">相关服务</view>
			<view class="service-ul">
				<view class="service-li">
					<view class="service-icon">
						<uni-icons type="color" size="40" color="#767676"></uni-icons>
					</view>
					<view class="service-title">某功能</view>
				</view>
				<view class="service-li">
					<view class="service-icon">
						<uni-icons type="color" size="40" color="#767676"></uni-icons>
					</view>
					<view class="service-title">某功能</view>
				</view>
				<view class="service-li">
					<view class="service-icon">
						<uni-icons type="color" size="40" color="#767676"></uni-icons>
					</view>
					<view class="service-title">某功能</view>
				</view>
				<view class="service-li">
					<view class="service-icon">
						<uni-icons type="color" size="40" color="#767676"></uni-icons>
					</view>
					<view class="service-title">某功能</view>
				</view>
			</view>
			<view class="service-ul">
				<view class="service-li">
					<view class="service-icon">
						<uni-icons type="color" size="40" color="#767676"></uni-icons>
					</view>
					<view class="service-title">某功能</view>
				</view>
				<view class="service-li">
					<view class="service-icon">
						<uni-icons type="color" size="40" color="#767676"></uni-icons>
					</view>
					<view class="service-title">某功能</view>
				</view>
				<view class="service-li">
					<view class="service-icon">
						<uni-icons type="color" size="40" color="#767676"></uni-icons>
					</view>
					<view class="service-title">某功能</view>
				</view>
				<view class="service-li">
					<view class="service-icon">
						<uni-icons type="color" size="40" color="#767676"></uni-icons>
					</view>
					<view class="service-title">某功能</view>
				</view>
			</view>
		</view>
		<view class="other-cards">
			<one-row-card></one-row-card>
		</view>
	</view>
</template>

<script setup lang="ts">
import { uniLogin } from "@/apis/uni.api";
import { reactive, ref } from "vue";
import { useMeStore } from "@/stores/me.store";
import quickEntryCard from "@/components/quickEntryCard.vue";
import oneRowCard from "@/components/oneRowCard.vue";
import { getToken } from "@/utils/auth";
import { userDefaultData } from "@/const";
import { onShow, onInit, onLoad, onReady } from "@dcloudio/uni-app";
import { logoUrl } from "@/const";

const meStore = useMeStore();

const isLogin = ref(false);
// 通过分享链接点击进入传递的参数
const params = reactive({
	questionnaireId: "",
	ownerId: "",
	curScene: 0,
});

onShow(() => {
	console.log("page me show...");
	isLogin.value = getToken("refreshToken") !== "";
});

onLoad(async (option) => {
	params.questionnaireId = option?.questionnaireId;
	params.ownerId = option?.ownerId;
	params.curScene = option?.curScene;
});

async function login() {
	const { code } = await uniLogin("weixin");
	meStore.$patch({ inLogin: true }); // 登录时不需要传入JWT
	await meStore.loginAndAutoSignUp(code);
	meStore.$patch({ inLogin: false });
	isLogin.value = getToken("refreshToken") !== "";
	// TODO 可以检查获取用户信息的nickName及avatarUrl是否为空，从而提示用户补充信息
	if (params.curScene == 1) {
		uni.navigateTo({
			url: `/pages/questionnaire/write?questionnaireId=${params.questionnaireId}&ownerId=${params.ownerId}&friendId=${meStore.user?.id}`,
		});
	}
}

function toUpdateUser() {
	uni.navigateTo({
		url: "/pages/me/updateUser",
	});
}
</script>

<style lang="scss" scoped>
.top-card {
	height: 35vh;
	width: 100vw;
	overflow: hidden; // 形成BFC，使user-info中的margin-top生效
	/* background-color: $theme-color-lighter-5; */
	background: linear-gradient(to right, $theme-color-lighter-4, $theme-color-lighter-5);
	border-radius: 20px;

	.user-info {
		height: 27%;
		width: 100%;
		margin-top: 25%;
		padding: 0 5%;
		display: flex;
		align-items: center;
		.info {
			height: 100%;
			width: 80%;
			display: flex;
			align-items: center;
			.nick-name {
				font-weight: 900;
				font-size: 18px;
			}
			.id {
				margin-top: 5px;
				font-size: 14px;
				color: $theme-color-gray;
			}
			.text-info {
				margin-left: 20px;
			}
		}
		.icon {
			height: 30px;
			width: 30px;
			border-radius: 15px;
		}
	}

	.quick-entry {
		margin-top: 10px;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
}

.service-card {
	background-color: #ffffff;
	width: calc(100vw - 40px);
	height: 30vh;
	position: relative;
	top: -20px;
	z-index: -10;
	padding: 40px 20px 20px 20px;
	.title {
		font-size: 18px;
	}
	.service-ul {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20px;
		.service-li {
			.service-icon {
				height: 40px;
				width: 40px;
				padding: 15px;
				background-color: $theme-color-background;
				border-radius: 15px;
			}
			.service-title {
				/* width: 70px; */
				margin-top: 5px;
				text-align: center;
				font-size: 14px;
				color: $theme-color-gray;
			}
		}
	}
}

.other-cards {
	position: relative;
	top: -20px;
}

.no-login {
	.logo {
		height: 40vh;
		width: 100vw;
		margin-top: 5vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.tips {
		width: 90vw;
		border-top: 1px solid $uni-text-color-disable;
		padding: 50px 20px;

		.tips-title {
			font-size: 24px;
			text-align: left;
			font-weight: 900;
		}
		.tips-content {
			margin-top: 16px;
			text-align: left;
			color: $theme-color-gray;
		}
	}

	.login-button-container {
		.login-button {
			color: #ffffff;
			background-color: $theme-color-lighter-2;
			height: 60px;
			width: 90vw;
			line-height: 60px;
			text-align: center;
			border-radius: 30px;
		}
	}
}
</style>
