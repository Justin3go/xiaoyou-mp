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
					<view class="questionnaire-count">{{ questionnaireCount }}</view>
					<view class="questionnaire-title">待填问卷</view>
				</view>
				<view class="share-container">
					<view class="share-code">
						<image style="height: 20px; width: 20px" :src="shareCodeUrl"></image>
					</view>
					<view class="share-title">分享码</view>
				</view>
			</view>
		</view>

		<view class="common-container">
			<view class="common-item">
				<view class="common-icon">
					<uni-icons type="color" size="40" color="#767676"></uni-icons>
				</view>
				<view class="common-title">某功能</view>
			</view>
			<view class="common-item">
				<view class="common-icon">
					<uni-icons type="color" size="40" color="#767676"></uni-icons>
				</view>
				<view class="common-title">某功能</view>
			</view>
			<view class="common-item">
				<view class="common-icon">
					<uni-icons type="color" size="40" color="#767676"></uni-icons>
				</view>
				<view class="common-title">某功能</view>
			</view>
			<view class="common-item">
				<view class="common-icon">
					<uni-icons type="color" size="40" color="#767676"></uni-icons>
				</view>
				<view class="common-title">某功能</view>
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
			<uni-icons type="mail-open-filled" size="80" color="#dbdbdb"></uni-icons>
			<view class="no-news-text">暂无消息</view>
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
import { useMutation } from "villus";
import { ref } from "vue";
import { userDefaultData, shareCodeUrl, bannerUrl1 } from "@/const";
import oneRowCard from "@/components/oneRowCard.vue";

const meStore = useMeStore();
const questionnaireCount = ref(12);
// TODO 消息服务端不做记录，只做保存，推送过来之后就删除了，所以这里后面需要保存在本地
const news = ref([
	{ id: "1", content: "你有新的消息通知" },
	{ id: "2", content: "你有新的消息通知" },
	{ id: "3", content: "你有新的消息通知" },
	{ id: "4", content: "你有新的消息通知" },
	{ id: "5", content: "你有新的消息通知:这是一则非常非常非常非常非常非常非常非常非常非常非常非常长的消息内容" },
]);
// 更多消息的弹窗
const newsPopup = ref();
const curNewsId = ref("");
const curNewsContent = ref("");

async function getUser() {
	const { execute } = useMutation(meGQL);
	uni.showLoading({ title: "正在查询中..." });
	const { data, error } = await execute();
	console.log("query user data: ", data);
	console.log("query user error: ", error);
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
	// TODO 没有消息时的兜底显示
	const deleteItem = news.value.findIndex((item) => item.id === curNewsId.value);
	news.value.splice(deleteItem, 1);
	newsPopup.value.close();
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
	display: flex;
	padding: 10px;
	justify-content: space-between;
	align-items: center;
	.user-left {
		display: flex;
		justify-content: space-around;
		align-items: center;

		.info {
			margin-left: 10px;
			.nick-name {
				font-weight: 900;
				font-size: 18px;
				color: $theme-color-dark;
			}

			.id {
				margin-top: 5px;
				font-size: 12px;
				color: $theme-color-gray;
			}
		}
	}

	.user-right {
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
		.share-container {
			width: 70px;
			height: 55px;
			border-left: 1px solid $theme-color-gray-lighter;
			.share-code {
				width: 100%;
				display: flex;
				justify-content: center;
			}
			.share-title {
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
		height: 40px;
		width: 40px;
		padding: 15px;
		background-color: $theme-color-background;
		border-radius: 15px;
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
	width: 80px;
	margin: auto;
	padding-top: 80px;

	.no-news-text {
		text-align: center;
		color: #dbdbdb;
	}
}
</style>
