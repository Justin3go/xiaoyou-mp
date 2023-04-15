<template>
	<view class="common-card-container" @click="clickAction" @touchstart="touchStart" @touchend="touchEnd(1000)">
		<view class="title">{{ props.title }}</view>
		<view class="content">
			<image class="left-img" :src="questionnaireUrl" mode="widthFix"></image>
			<view class="description">{{ props.description }}</view>
		</view>
		<slot>
			<view class="actions">
				<view class="btn-container">
					<button
						style="
							width: 80px;
							height: 40px;
							line-height: 34px;
							margin-left: 10px;
							background-color: #ffffff;
							border: 3px solid #0256ff;
							color: #0256ff;
						"
						@click="firstBtnClick"
					>
						{{ props.firstBtnText }}
					</button>
					<button
						v-if="props.secondBtn"
						style="width: 80px; height: 40px; line-height: 40px; background-color: #0256ff; color: #ffffff"
						:open-type="props.secondBtnType"
						:data-data="props.secondBtnData"
						@click="secondBtnClick"
					>
						{{ props.secondBtnText }}
					</button>
				</view>
			</view>
		</slot>
	</view>
</template>
<script setup lang="ts">
import { questionnaireUrl } from "@/const";

interface propsI {
	title: string;
	description: string;
	secondBtn: boolean; // 是否有第二个button
	firstBtnText: string;
	secondBtnText: string;
	secondBtnType: string;
	secondBtnData: string;
}

interface emitI {
	(e: "clickAction"): void;
	(e: "touchAction"): void;
	(e: "firstBtnClick"): void;
	(e: "secondBtnClick"): void;
}

const props = withDefaults(defineProps<propsI>(), {
	secondBtn: true,
	firstBtnText: "查看",
	secondBtnText: "分享",
	secondBtnType: "",
	secondBtnData: "",
});
const emit = defineEmits<emitI>();
const btnContainerWidth = props.secondBtn ? "170px" : "80px";

function clickAction() {
	emit("clickAction");
}

let startTime = 0;

function touchStart() {
	startTime = new Date().getTime();
}

function touchEnd(duration: number) {
	const endTime = new Date().getTime();
	const diffTime = endTime - startTime;
	if (diffTime > duration) {
		console.log("触发长按事件...");
		// TODO 可以震动一下
		emit("touchAction");
	}
}

function firstBtnClick() {
	emit("firstBtnClick");
}

function secondBtnClick() {
	emit("secondBtnClick");
}
</script>
<style lang="scss" scoped>
.common-card-container {
	width: calc(100vw - 40px);
	background-color: #ffffff;
	margin-top: 10px;
	padding: 20px;
	padding-top: 10px;
	.title {
		font-size: 18px;
		/* font-weight: 900; */
		color: $theme-color-dark;
		text-align: right;
	}
	.content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		.description {
			font-size: 16px;
			color: $theme-color-gray;
			text-align: left;
			margin-top: 10px;
			width: 70%;

			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
		}
		.left-img {
			width: 20%;
		}
	}
	.actions {
		width: 100%;
		display: flex;
		direction: rtl;
		.btn-container {
			display: flex;
			width: v-bind(btnContainerWidth);
			margin: 20px 0 0 0;
		}
	}
}
</style>
