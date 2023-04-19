<template>
	<view class="left-bubble-container">
		<view class="right">
			<image :src="props.avatarUrl"></image>
		</view>
		<view class="left">
			<view class="bubble">
				<span style="direction: ltr; unicode-bidi: bidi-override">
					<text>{{ props.message }}</text>
				</span>
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
	display: flex;
	direction: rtl;
	margin: 10px 0;
	.right {
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
	margin-right: 20px;
	padding: 15px;
	text-align: left;
	text {
		height: 25px;
		line-height: 25px;
	}
}
.bubble::after {
	position: absolute;
	top: 15px;
	right: -20px;
	content: "";
	width: 0;
	height: 0;
	border-right: 10px solid transparent;
	border-bottom: 10px solid transparent;
	border-left: 10px solid #ffffff;
	border-top: 10px solid transparent;
}
</style>
