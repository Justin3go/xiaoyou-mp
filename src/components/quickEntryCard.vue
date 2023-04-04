<template>
	<view class="quick-entry-container">
		<view class="title-container">
			<slot name="title"> 快捷入口 </slot>
		</view>
		<view class="icon-container">
			<slot name="icon">
				<uni-icons type="color" size="40" color="#FFFFFF"></uni-icons>
			</slot>
		</view>
	</view>
</template>
<script setup lang="ts">
interface propsI {
	// 可传入其他长度单位如80%，将直接运用于该组件顶部容器的height
	containerHeight: string;
	containerWidth: string;
}

const props = withDefaults(defineProps<propsI>(), {
	containerHeight: "80px",
	containerWidth: "190px",
});
const height = props.containerHeight;
const width = props.containerWidth;

</script>

<style lang="scss" scoped>
.quick-entry-container {
	height: v-bind(height);
	width: v-bind(width);
	background-color: white;
	border-radius: 15px;
	display: flex;
	align-items: center;
	justify-content: space-around;
  .title-container{
    flex: 1;
    padding: 0 20px;
		font-size: 18px;
  }
  .icon-container {
    width: 40px;
    height: 40px;
    padding: 10px;
    border-radius: 15px;
    background-color: $theme-color-lighter-3;
    margin-right: 15px;
  }
}
</style>
