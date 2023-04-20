<template>
	<view class="index-container">
		<view class="banner-container">
			<swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="2000" :duration="500">
				<swiper-item>
					<image style="height: 30vh; width: 100vw" :src="bannerUrl1"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="user-container">
			<view class="user-left">
				<view class="avatar">
					<image
						style="height: 60px; width: 60px; border-radius: 30px"
						:src="meStore.user?.avatarUrl || userDefaultData.avatarUrl"
					></image>
				</view>
				<view class="info">
					<view class="nick-name">{{ meStore.user?.nickName || userDefaultData.nickName }}</view>
					<view class="id">{{ meStore.user?.id || userDefaultData.id }}</view>
				</view>
			</view>
			<view class="user-right">
				<view class="questionnaire-container">
					<view class="questionnaire-count">
						{{ dataFriend?.me.countAsFriend ?? "--" }}
					</view>
					<view class="questionnaire-title">已填</view>
				</view>
				<view class="owner-container">
					<view class="owner-code">
						{{ dataOwner?.me.countAsOwner ?? "--" }}
					</view>
					<view class="owner-title">被填</view>
				</view>
			</view>
		</view>

		<view class="common-container">
			<view class="common-item">
				<view class="common-icon" @click="toQuestionnaire">
					<image style="height: 45px; width: 45px" :src="indexIcon1"></image>
				</view>
				<view class="common-title">查看问卷</view>
			</view>
			<view class="common-item">
				<view class="common-icon" @click="toRankListMe">
					<image style="height: 45px; width: 45px" :src="indexIcon2"></image>
				</view>
				<view class="common-title">关于自己</view>
			</view>
			<view class="common-item">
				<view class="common-icon" @click="toRankListOther">
					<image style="height: 45px; width: 45px" :src="indexIcon3"></image>
				</view>
				<view class="common-title">关于他人</view>
			</view>
			<view class="common-item">
				<view class="common-icon" @click="toQA">
					<image style="height: 45px; width: 45px" :src="indexIcon4"></image>
				</view>
				<view class="common-title">心理问答</view>
			</view>
		</view>

		<view class="news-title"> 消息中心 </view>
		<view class="news-container" v-for="item in news" :key="item.id">
			<one-row-card>
				<template #left>
					{{ item.content }}
				</template>
				<template #rightIcon>
					<uni-icons type="forward" size="30" color="#D3D3D3" @click="clickNewsCard(item)"></uni-icons>
				</template>
			</one-row-card>
		</view>
		<view v-if="!news.length" class="no-news">
			<empty></empty>
		</view>
		<uni-popup ref="newsPopup" type="dialog">
			<uni-popup-dialog
				type="info"
				title="消息详情"
				confirmText="已读"
				cancelText="关闭"
				:content="curNewsContent"
				:duration="2000"
				@close="closeNews"
				@confirm="confirmNews"
			></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script setup lang="ts">
import { meGQL } from "@/graphql/me.graphql";
import { useMeStore } from "@/stores/me.store";
import { useMutation, useQuery } from "villus";
import { ref, watch } from "vue";
import { userDefaultData, bannerUrl1 } from "@/const";
import oneRowCard from "@/components/oneRowCard.vue";
import empty from "@/components/empty.vue";
import { onPullDownRefresh, onShow } from "@dcloudio/uni-app";
import { indexIcon1, indexIcon2, indexIcon3, indexIcon4 } from "@/const";
import { countAsFriendGQL, countAsOwnerGQL } from "@/graphql/index.graphql";

const meStore = useMeStore();
// TODO 消息服务端不做记录，只做保存，推送过来之后就删除了，所以这里后面需要保存在本地
const news = ref([]);
// 更多消息的弹窗
const newsPopup = ref();
const curNewsId = ref("");
const curNewsContent = ref("");

const {
	data: dataFriend,
	execute: executeFriend,
	error: errorFriend,
} = useQuery({ query: countAsFriendGQL, paused: () => true });
const {
	data: dataOwner,
	execute: executeOwner,
	error: errorOwner,
} = useQuery({ query: countAsOwnerGQL, paused: () => true });

watch(errorFriend, (newVal) => {
	uni.showToast({
		title: `获取数量失败`,
		icon: "error",
		duration: 2000,
	});
	throw new Error(`获取数量失败errorFriend: ${newVal}`);
});

watch(errorOwner, (newVal) => {
	uni.showToast({
		title: `获取数量失败`,
		icon: "error",
		duration: 2000,
	});
	throw new Error(`获取数量失败errorOwner: ${newVal}`);
});

onShow(async () => {
	if (meStore.user === null) {
		await getUser();
	}
	await executeFriend();
	await executeOwner();
	console.log("App Show");
});

onPullDownRefresh(async () => {
	await executeFriend();
	await executeOwner();
	uni.stopPullDownRefresh();
});

async function getUser() {
	const { execute } = useMutation(meGQL);
	const { data, error } = await execute();
	console.log("query user data: ", data);
	console.log("query user error: ", error);
	if(data?.me) {
		meStore.$patch({ user: data.me });
	}
}

function clickNewsCard(item: { id: string; content: string }) {
	curNewsId.value = item.id;
	curNewsContent.value = item.content;
	newsPopup.value.open();
}

function closeNews() {
	newsPopup.value.close();
}

function confirmNews() {
	const deleteItem = news.value.findIndex((item) => item.id === curNewsId.value);
	news.value.splice(deleteItem, 1);
	newsPopup.value.close();
}

// common
function toQuestionnaire() {
	setTimeout(
		() =>
			uni.switchTab({
				url: "/pages/questionnaire/index",
			}),
		500 // 等待点击动画
	);
}
function toRankListMe() {
	setTimeout(
		() =>
			uni.navigateTo({
				url: "/pages/me/rankList?option=me",
			}),
		500
	);
}
function toRankListOther() {
	setTimeout(
		() =>
			uni.navigateTo({
				url: "/pages/me/rankList?option=other",
			}),
		500
	);
}
function toQA() {
	uni.showToast({
		title: "敬请期待",
		icon: "none",
		duration: 2000,
	});
}
</script>

<style lang="scss" scoped>
.banner-container {
	.swiper {
		height: 30vh;
		width: 100vw;
	}
}
.user-container {
	height: 80px;
	width: calc(100vw - 20px);
	display: flex;
	padding: 10px;
	justify-content: space-between;
	align-items: center;
	.user-left {
		display: flex;
		justify-content: space-around;
		align-items: center;

		width: calc(100% - 120px);
		.info {
			margin-left: 10px;
			width: calc(100% - 70px);
			.nick-name {
				font-weight: 900;
				font-size: 18px;
				color: $theme-color-dark;
			}

			.id {
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-top: 5px;
				font-size: 12px;
				color: $theme-color-gray;
			}
		}
	}

	.user-right {
		width: 120px;
		font-size: 15px;
		display: flex;
		justify-content: space-around;
		align-items: center;
		.questionnaire-container {
			margin-right: 10px;
			.questionnaire-count {
				text-align: center;
			}
			.questionnaire-title {
				margin-top: 15px;
				text-align: center;
			}
		}
		.owner-container {
			width: 60px;
			height: 55px;
			border-left: 1px solid $theme-color-gray-lighter;
			.owner-code {
				width: 100%;
				display: flex;
				justify-content: center;
			}
			.owner-title {
				margin-top: 15px;
				text-align: center;
			}
		}
	}
}

.common-container {
	display: flex;
	justify-content: space-around;
	align-items: center;
	margin-top: 10px;
	background-color: #ffffff;
	height: 120px;
	width: 90vw;
	border-radius: 25px;
	margin: auto;
	padding: 0 3vw;
	.common-icon {
		height: 45px;
		width: 45px;
		padding: 10px;
		background-color: $theme-color-background;
		border-radius: 15px;
		box-shadow: 5px 5px 20px #dddddd;
		transition: 0.3s;
	}
	.common-icon:active {
		height: 35px;
		width: 35px;
		padding: 15px;
		box-shadow: 5px 5px 20px #ffffff;
	}
	.common-title {
		margin-top: 5px;
		text-align: center;
		font-size: 14px;
		color: $theme-color-gray;
	}
}

.news-title {
	text-align: left;
	font-size: 18px;
	font-weight: 900;
	color: $theme-color-dark;
	width: 92vw;
	height: 16px;
	line-height: 16px;
	margin: auto;
	padding: 20px 0;
}

.no-news {
	padding-top: 50px;
}
</style>
