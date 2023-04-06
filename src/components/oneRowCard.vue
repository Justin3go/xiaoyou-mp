<template>
	<view class="one-row-container">
		<view class="left">
			<slot name="left"> 这是一则推广消息... </slot>
		</view>
		<view class="right">
			<view class="right-text">
				<slot name="rightText"> 更多 </slot>
			</view>
			<view v-if="props.showIcon" class="right-icon">
				<slot name="rightIcon">
					<uni-icons type="forward" size="30" color="#D3D3D3"></uni-icons>
				</slot>
			</view>
		</view>
	</view>
</template>
<script setup lang="ts">
interface propsI {
	showIcon: boolean;
	rightTextWidth: string;
}

const props = withDefaults(defineProps<propsI>(), {
	showIcon: true,
	rightTextWidth: "50px",
});

const width = props.rightTextWidth;
</script>
<style lang="scss" scoped>
.one-row-container {
	height: 68px;
	width: 100vw;
	background-color: #ffffff;
	border-top: 0.5px solid #ececec;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.left {
		width: 70%;
		padding-left: 20px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.right {
		display: flex;
		justify-content: space-around;
		align-items: center;
		.right-text {
			width: v-bind(width);
		}
		.right-icon {
			width: 30px;
			margin-right: 10px;
		}
	}
}
</style>
