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
						style="height: 60px; width: 60px; border-radius: 50%"
						:src="meStore.user?.avatarUrl || userDefaultData.avatarUrl"
					></image>
					<view class="text-info">
						<view class="nick-name">{{ meStore.user?.nickName || userDefaultData.nickName }}</view>
						<view class="id">{{ meStore.user?.id || userDefaultData.id }}</view>
					</view>
				</view>
				<view class="icon" @click="toUpdateUser">
					<uni-icons type="forward" size="30" color="#D3D3D3"></uni-icons>
				</view>
			</view>
			<view class="quick-entry">
				<view @click="toRankList('me')">
					<quick-entry-card>
						<template #title>关于自己</template>
						<template #icon>
							<uni-icons type="auth" size="40" color="#FFFFFF"></uni-icons>
						</template>
					</quick-entry-card>
				</view>
				<view @click="toRankList('other')">
					<quick-entry-card>
						<template #title>关于他人</template>
						<template #icon>
							<uni-icons type="staff" size="40" color="#FFFFFF"></uni-icons>
						</template>
					</quick-entry-card>
				</view>
			</view>
		</view>
		<view class="service-card">
			<view class="title">相关服务</view>
			<view class="service-ul">
				<view class="service-li">
					<view class="service-icon" @click="helpService">
						<uni-icons type="help" size="35" color="#030a27"></uni-icons>
					</view>
					<view class="service-title">帮助中心</view>
				</view>
				<view class="service-li">
					<view class="service-icon" @click="feedbackService">
						<uni-icons type="chat" size="35" color="#030a27"></uni-icons>
					</view>
					<view class="service-title">意见反馈</view>
				</view>
				<view class="service-li">
					<button class="share-btn" open-type="share">
						<view class="service-icon">
							<uni-icons type="paperplane" size="35" color="#030a27"></uni-icons>
						</view>
					</button>
					<view class="service-title">分享小程序</view>
				</view>
				<view class="service-li">
					<view class="service-icon" @click="customerChatService">
						<uni-icons type="headphones" size="35" color="#030a27"></uni-icons>
					</view>
					<view class="service-title">智能客服</view>
				</view>
			</view>
			<view class="service-ul">
				<view class="service-li">
					<view class="service-icon" @click="supportService">
						<uni-icons type="hand-up" size="35" color="#030a27"></uni-icons>
					</view>
					<view class="service-title">支持我们</view>
				</view>
				<view class="service-li">
					<view class="service-icon" @click="codeService">
						<uni-icons type="flag" size="35" color="#030a27"></uni-icons>
					</view>
					<view class="service-title">代码开源</view>
				</view>
				<view class="service-li">
					<view class="service-icon" @click="aboutService">
						<uni-icons type="info" size="35" color="#030a27"></uni-icons>
					</view>
					<view class="service-title">关于笑友</view>
				</view>
				<view class="service-li">
					<view class="service-icon" @click="moreService">
						<uni-icons type="more" size="35" color="#030a27"></uni-icons>
					</view>
					<view class="service-title">更多</view>
				</view>
			</view>
		</view>
		<uni-popup ref="infoPopup" type="dialog">
			<uni-popup-dialog
				type="info"
				content="链接已经复制到剪贴板，请打开浏览器进行下一步操作"
				:duration="3000"
				@close="closeInfo"
				@confirm="confirmInfo"
			></uni-popup-dialog>
		</uni-popup>
		<view class="other-cards">
			<one-row-card>
				<template #left>这是一则推广消息(广告位招租)</template>
			</one-row-card>
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
import { onShow, onLoad, onShareAppMessage } from "@dcloudio/uni-app";
import { logoUrl, feedbackUrl, sourceCodeUrl } from "@/const";
import { useMutation } from "villus";
import { meGQL } from "@/graphql/me.graphql";

const meStore = useMeStore();

const isLogin = ref(false);
// 通过分享链接点击进入传递的参数
const params = reactive({
	questionnaireId: "",
	ownerId: "",
	curScene: 0,
});

const infoPopup = ref();

onShow(() => {
	console.log("page me show...");
	isLogin.value = getToken("refreshToken") !== "";
});

onLoad(async (option) => {
	params.questionnaireId = option?.questionnaireId;
	params.ownerId = option?.ownerId;
	params.curScene = option?.curScene;

	// 内存中无登录信息，但storage中存有token，就重新获取用户信息
	isLogin.value = getToken("refreshToken") !== "";
	let userId = meStore.user?.id;
	if (isLogin.value && !userId) {
		console.log("重新获取用户信息...");
		await getUser();
		userId = meStore.user?.id;
	}
	// 1. userId存在代表已经登录
	// 2. curScene==1代表是点击好友分享链接进入的
	// 3. userId !== params.ownerId代表点击自己分享的链接不会跳转
	const isNavigateTo = userId && params.curScene == 1 && userId !== params.ownerId;
	// 如果是已经登录了的，且是点击好友分享链接进入的，就直接跳转到问卷填写页
	if (isNavigateTo) {
		uni.navigateTo({
			url: `/pages/questionnaire/write?questionnaireId=${params.questionnaireId}&ownerId=${params.ownerId}&friendId=${userId}`,
		});
	}
});

async function login() {
	const { code } = await uniLogin("weixin");
	meStore.$patch({ inLogin: true }); // 登录时不需要传入JWT
	await meStore.loginAndAutoSignUp(code);
	meStore.$patch({ inLogin: false });
	isLogin.value = getToken("refreshToken") !== "";
	// TODO 可以检查获取用户信息的nickName及avatarUrl是否为空，从而提示用户补充信息

	// 登录后检测是否为分享链接进入，是则跳转问卷填写
	const userId = meStore.user?.id;
	const isNavigateTo = params.curScene == 1 && userId !== params.ownerId;
	if (isNavigateTo) {
		uni.navigateTo({
			url: `/pages/questionnaire/write?questionnaireId=${params.questionnaireId}&ownerId=${params.ownerId}&friendId=${userId}`,
		});
	}
}

async function getUser() {
	const { execute } = useMutation(meGQL);
	const { data, error } = await execute();
	console.log("query user data: ", data);
	console.log("query user error: ", error);
	meStore.$patch({ user: data.me });
}

function toUpdateUser() {
	uni.navigateTo({
		url: "/pages/me/updateUser",
	});
}

function toRankList(option: "me" | "other") {
	uni.navigateTo({
		url: `/pages/me/rankList?option=${option}`,
	});
}

function closeInfo() {
	infoPopup.value.close();
}

function confirmInfo() {
	infoPopup.value.close();
}

onShareAppMessage((res: any) => {
	if (res.from === "button") {
		// 来自页面内分享按钮
		console.log("share target: ", res.target);
	}
	return {
		title: "我正在使用笑友小程序，快来一起使用吧~",
		path: `/pages/me/index`,
		imageUrl: logoUrl,
	};
});

// 相关服务
function helpService() {
	uni.navigateTo({
		url: "/pages/me/helpService",
	});
}

function feedbackService() {
	uni.setClipboardData({
		data: feedbackUrl,
		success: function () {
			infoPopup.value.open();
		},
	});
}

function customerChatService() {
	uni.navigateTo({
		url: "/pages/me/customerChatService",
	});
}

function supportService() {
	uni.navigateTo({
		url: "/pages/me/supportService",
	});
}

function codeService() {
	uni.setClipboardData({
		data: sourceCodeUrl,
		success: function () {
			infoPopup.value.open();
		},
	});
}

function aboutService() {
	uni.navigateTo({
		url: "/pages/me/aboutService",
	});
}

function moreService() {
	uni.showToast({
		title: "敬请期待",
		icon: "none",
		duration: 2000,
	});
}
</script>

<style lang="scss" scoped>
.top-card {
	height: 300px;
	width: 100vw;
	overflow: hidden; // 形成BFC，使user-info中的margin-top生效
	/* background-color: $theme-color-lighter-5; */
	background: linear-gradient(to right, $theme-color-lighter-4, $theme-color-lighter-5);
	border-radius: 0 0 20px 20px;
	position: relative;
	top: 0;
	left: 0;
	z-index: 20;

	.user-info {
		height: 90px;
		width: calc(100% - 20px);
		margin-top: 25%;
		padding: 0 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.info {
			height: 100%;
			width: 80%;
			display: flex;
			align-items: center;
			.text-info {
				margin-left: 10px;
				width: calc(100% - 70px);

				.nick-name {
					font-weight: 900;
					font-size: 18px;
				}
				.id {
					margin-top: 5px;
					font-size: 12px;
					color: $theme-color-gray;
				}
			}
		}
		.icon {
			height: 30px;
			width: 30px;
		}
	}

	.quick-entry {
		padding: 0 1vw;
		margin-top: 10px;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
}

.service-card {
	background-color: #ffffff;
	width: calc(100vw - 40px);
	height: 270px;
	position: relative;
	top: -20px;
	z-index: 10; // 不能为负，为负其所有点击事件都不会生效
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
				height: 35px;
				width: 35px;
				line-height: 35px;
				padding: 15px;
				background-color: $theme-color-background;
				border-radius: 15px;
				z-index: 10;
			}
			.service-title {
				/* width: 70px; */
				margin-top: 5px;
				text-align: center;
				font-size: 14px;
				color: $theme-color-gray;
			}
			.share-btn {
				padding-left: 0;
				padding-right: 0;
				height: 65px;
				width: 65px;
				background-color: transparent;
				border-color: transparent;
			}

			.share-btn::after {
				border: none;
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
		padding-bottom: 50px;
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
