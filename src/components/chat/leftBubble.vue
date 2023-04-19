<template>
	<view class="left-bubble-container">
		<view class="left">
			<image :src="props.avatarUrl"></image>
		</view>
		<view class="right">
			<view class="bubble">
				<text>{{ props.message }}</text>
			</view>
		</view>
	</view>
</template>
<script setup lang="ts">
import { userDefaultData } from "@/const";

interface propsI {
	message: string;
	avatarUrl: string;
}

const props = withDefaults(defineProps<propsI>(), {
	avatarUrl: userDefaultData.avatarUrl,
});
</script>
<style lang="scss" scoped>
.left-bubble-container {
  margin: 10px 0;
	display: flex;
	.left {
		image {
			height: 50px;
			width: 50px;
			border-radius: 5px;
		}
	}
}
.bubble {
	max-width: calc(100vw - 160px);
	min-height: 25px;
	border-radius: 10px;
	background-color: #ffffff;
	position: relative;
	margin-left: 20px;
	padding: 15px;
	text {
		height: 25px;
		line-height: 25px;
	}
}
.bubble::before {
	position: absolute;
	top: 15px;
	left: -20px;
	content: "";
	width: 0;
	height: 0;
	border-right: 10px solid #ffffff;
	border-bottom: 10px solid transparent;
	border-left: 10px solid transparent;
	border-top: 10px solid transparent;
}
</style>
