<template>
	<view class="chat-container">
		<view class="msg-container">
			<!-- https://github.com/wepyjs/wepy-wechat-demo/issues/7 -->
			<scroll-view scroll-y="true" :scroll-into-view="`msg${messages.length-1}`" :scroll-with-animation="true">
				<view class="msg-list" :id="`msg${index}`" v-for="(msg, index) in messages" :key="msg.time">
					<view class="msg-item">
						<left-bubble v-if="msg.left" :message="msg.text" :avatar-url="meStore.user?.avatarUrl"></left-bubble>
						<right-bubble v-else :message="msg.text" :avatar-url="logoUrl"></right-bubble>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="bottom-input">
			<view class="textarea-container">
				<textarea
					auto-height
					fixed="true"
					confirm-type="send"
					v-model="input"
					@confirm="submit"
				/>
			</view>
			<button
				style="
					width: 70px;
					height: 40px;
					line-height: 34px;
					margin: 0 10px;
					background-color: #ffffff;
					border: 3px solid #0256ff;
					color: #0256ff;
				"
				@click="submit"
			>
				发送
			</button>
		</view>
	</view>
</template>
<script setup lang="ts">
import { ref, type Ref } from "vue";
import leftBubble from "./leftBubble.vue";
import rightBubble from "./rightBubble.vue";
import type { messagesI } from "./chat.interface";
import { chatGQL } from "@/graphql/me.graphql";
import { useQuery } from "villus";
import { logoUrl } from "@/const";
import { useMeStore } from "@/stores/me.store";

const meStore = useMeStore();

const messages: Ref<messagesI[]> = ref([]);
const input = ref("");

async function submit() {
	if (input.value === "") return;
	messages.value.push({
		left: true,
		text: input.value,
		time: new Date().getTime(),
	});
	const { execute } = useQuery({ query: chatGQL, variables: { talk: input.value } });
	uni.showLoading({ title: "正在加载中" });
	const { error, data } = await execute();
	if (error) {
		uni.showToast({
			title: `加载错误: ${error}`,
			icon: "error",
			duration: 3000,
		});
		throw new Error(`加载错误: ${error}`);
	}
	const receive = data?.customerChat;
	const finalMsg = receive?.knowledge || receive?.text || "你是否想问: " + receive?.recommend;
	messages.value.push({
		left: false,
		text: finalMsg,
		time: new Date().getTime(),
	});
	if (receive?.recommend) {
		input.value = receive?.recommend;
	} else {
		input.value = "";
	}
}

</script>
<style lang="scss" scoped>
.chat-container {
	.msg-container {
		padding: 20px 5px 100px 5px;
		height: calc(100vh - 120px);
		scroll-view {
			height: 100%;
		}
	}
	.bottom-input {
		display: flex;
		align-items: flex-end;
		position: fixed;
		bottom: 0px;
		background-color: #fbfbfb;
		padding: 20px;
		box-shadow: 0px -10px 30px #eeeeee;
		.textarea-container {
			background-color: #ffffff;
			padding: 10px;
			textarea {
				width: calc(100vw - 146px);
				background-color: #ffffff;
			}
		}
	}
}
</style>
