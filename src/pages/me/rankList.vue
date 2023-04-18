<template>
	<view class="rank-list-container">
		<view class="questionnaire-select">
			<uni-data-select v-model="curValue" :localdata="range" @change="chooseQuestionnaire"></uni-data-select>
		</view>
		<view class="top-placeholder"></view>
		<view v-show="!curQuestionnaireId" class="no-data">
			<empty info="请先选择问卷"></empty>
		</view>
		<view v-if="curQuestionnaireId && !rankData[curQuestionnaireId]?.length" class="no-data">
			<empty info="暂无排行，请先分享或帮助好友填写问卷"></empty>
		</view>
		<view class="rank-list" v-for="(item, index) in rankData[curQuestionnaireId]" :key="item.id">
			<view class="rank-item">
				<view class="info">
					<view class="order">
						<view v-if="index === 0">
							<image :src="firstRank"></image>
						</view>
						<view v-else-if="index === 1">
							<image :src="secondRank"></image>
						</view>
						<view v-else-if="index === 2">
							<image :src="thirdRank"></image>
						</view>
						<view class="number" v-else> {{ index + 1 }} </view>
					</view>
					<view class="avatar">
						<image
							style="height: 50px; width: 50px; border-radius: 25px"
							:src="item.avatarUrl || userDefaultData.avatarUrl"
						></image>
					</view>
					<view class="nick-name">{{ item.nickName }}</view>
				</view>
				<view class="similarity">{{ (item.similarity / 100).toFixed(2) }}</view>
			</view>
		</view>
	</view>
</template>
<script setup lang="ts">
import { onLoad, onShow } from "@dcloudio/uni-app";
import { ref, watch, type Ref } from "vue";
import type { RangeI } from "../show/show.interface";
import type { QuestionnaireI } from "../questionnaire/questionnaire.interface";
import { useQuery } from "villus";
import { meGQL } from "@/graphql/questionnaire.graphql";
import type { rankDataI } from "./me.interface";
import { listAsOwnerGQL, listAsFriendGQL } from "@/graphql/me.graphql";
import { userDefaultData, firstRank, secondRank, thirdRank } from "@/const";
import empty from "@/components/empty.vue";

const meOrOther: Ref<"me" | "other"> = ref("me");

const questionnaires: Ref<QuestionnaireI[]> = ref([]);
const range: Ref<RangeI[]> = ref([]);

watch(questionnaires, (newVal) => {
	range.value = newVal.map((item) => ({
		value: item.id,
		text: item.title,
	}));
});

const curValue = ref("");
const curQuestionnaireId = ref("");

onLoad((option) => {
	meOrOther.value = option?.option;
});

onShow(async () => {
	const { execute } = useQuery({ query: meGQL });
	const { error, data } = await execute();
	if (error) {
		uni.showToast({
			title: `获取已填写问卷失败: ${error}`,
			icon: "error",
			duration: 2000,
		});
		throw new Error(`获取已填写问卷失败: ${error}`);
	}
	questionnaires.value = data?.me.questionnairesAsOwnerAsFriend.map((item: any) => item.questionnaire) || [];
});

const rankData: Ref<rankDataI> = ref({});

async function chooseQuestionnaire(e: any) {
	console.log("chooseQuestionnaire: ", e);

	curQuestionnaireId.value = e;
	if (meOrOther.value === "me") {
		await getListAsOwner(e);
	} else {
		await getListAsFriend(e);
	}
}

async function getListAsOwner(questionnaireId: string) {
	const { execute } = useQuery({ query: listAsOwnerGQL, variables: { questionnaireId } });
	const { error, data } = await execute();
	if (error) {
		uni.showToast({
			title: `获取排行榜失败: ${error}`,
			icon: "error",
			duration: 2000,
		});
		throw new Error(`获取排行榜失败: ${error}`);
	}
	rankData.value[questionnaireId] = [];
	// 作为拥有者，我需要查看相关朋友列表的排行榜
	data?.listAsOwner.forEach((item: any) => {
		if (item.friend.id !== item.owner.id) {
			rankData.value[questionnaireId].push({
				id: item.friend.id,
				nickName: item.friend.nickName,
				avatarUrl: item.friend.avatarUrl,
				similarity: item.similarity,
			});
		}
	});
}

async function getListAsFriend(questionnaireId: string) {
	const { execute } = useQuery({ query: listAsFriendGQL, variables: { questionnaireId } });
	const { error, data } = await execute();
	if (error) {
		uni.showToast({
			title: `获取排行榜失败: ${error}`,
			icon: "error",
			duration: 2000,
		});
		throw new Error(`获取排行榜失败: ${error}`);
	}
	rankData.value[questionnaireId] = [];
	// 作为朋友，我需要查看相关问卷拥有者列表排行榜
	data?.listAsFriend.forEach((item: any) => {
		if (item.friend.id !== item.owner.id) {
			rankData.value[questionnaireId].push({
				id: item.owner.id,
				nickName: item.owner.nickName,
				avatarUrl: item.owner.avatarUrl,
				similarity: item.similarity,
			});
		}
	});
}
</script>
<style lang="scss" scoped>
.rank-list-container {
	.no-data {
		padding-top: 80px;
	}
	.rank-list {
		.rank-item {
			height: 60px;
			width: calc(100vw - 40px);
			background-color: #ffffff;
			padding: 15px 20px;
			border-bottom: 1px solid $theme-color-gray-lighter-1;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.info {
				width: 220px;
				display: flex;
				justify-content: space-around;
				align-items: center;

				.order {
					height: 50px;
					width: 50px;
					.number {
						font-size: 24px;
						font-weight: 900;
						text-align: center;
						line-height: 50px;
					}
					image {
						height: 50px;
						width: 50px;
					}
				}
				.avatar {
					margin: 0 10px;
				}
				.nick-name {
					width: 100px;
					font-size: 16px;
					color: $theme-color-dark;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.similarity {
				font-size: 25px;
				font-weight: 900;
				color: $theme-color-light;
			}
		}
	}
}

.questionnaire-select {
	position: fixed;
	top: -1px;
	width: 100vw;
	background-color: #ffffff;
	z-index: 1000;
}

.top-placeholder {
	height: 50px;
	width: 100vw;
}
</style>
