<template>
	<view class="nav-tabs-container">
		<view v-for="tab in tabs">
			<view class="tabs-item" :class="{ 'tabs-item-active': activeTab === tab }" @click="clickTab(tab)">{{ tab }}</view>
		</view>
	</view>
	<view class="nav-placeholder"></view>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";

interface propsI {
	modelValue: string;
	tabs: string[];
}

interface emitI {
	(e: "update:modelValue", newVal: string): void;
}

const props = defineProps<propsI>();
const emit = defineEmits<emitI>();

const tabs = props.tabs;
const activeTab = ref(props.modelValue);

function clickTab(tab: string) {
	activeTab.value = tab;
	emit("update:modelValue", tab);
}
</script>
<style lang="scss" scoped>
.nav-tabs-container {
	width: 100vw;
	height: 60px;
	background-color: #ffffff;
	display: flex;
	justify-content: space-around;
	align-items: center;
	position: fixed;
	top: -1px;

	z-index: 1000;

	.tabs-item {
		font-size: 18px;
		line-height: 60px;
	}
	.tabs-item-active {
		border-bottom: 4px solid $theme-color-light;
	}
}
.nav-placeholder {
	width: 100vw;
	height: 60px;
}
</style>
