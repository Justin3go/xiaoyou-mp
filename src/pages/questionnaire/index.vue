<template>
	<view class="questionnaire-container">
		<nav-tabs :tabs="tabs" v-model="activeTab"></nav-tabs>
		<view v-if="activeTab === tabs[0]" class="completed-container">
			<view class="questionnaire-ul" v-for="questionnaire in completed" :key="questionnaire.id">
				<view class="questionnaire-li">
					<common-card
						second-btn-type="share"
						:second-btn-data="questionnaire.id"
						:title="questionnaire.title"
						:description="questionnaire.description"
						@first-btn-click="look(questionnaire.id)"
					></common-card>
				</view>
			</view>
			<view v-if="!completed.length" class="no-data">
				<empty info="暂无问卷"></empty>
			</view>
		</view>
		<view v-if="activeTab === tabs[1]" class="no-completed-container">
			<view class="questionnaire-ul" v-for="questionnaire in noCompleted" :key="questionnaire.id">
				<view class="questionnaire-li">
					<common-card
						first-btn-text="填写"
						:title="questionnaire.title"
						:description="questionnaire.description"
						:second-btn="false"
						@first-btn-click="write(questionnaire.id)"
					>
					</common-card>
				</view>
			</view>
			<view v-if="!noCompleted.length" class="no-data">
				<empty info="暂无问卷"></empty>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import navTabs from "@/components/navTabs.vue";
import commonCard from "@/components/commonCard.vue";
import { onShareAppMessage, onShow } from "@dcloudio/uni-app";
import { useQuery } from "villus";
import { findAllQGQL, meGQL } from "@/graphql/questionnaire.graphql";
import type { Ref } from "@vue/reactivity";
import type { QuestionnaireI } from "./questionnaire.interface";
import { useMeStore } from "@/stores/me.store";
import empty from "@/components/empty.vue";
import { logoUrl } from "@/const";
import { watchEffect } from "vue";

const meStore = useMeStore();

const activeTab = ref("已填");
const tabs = ["已填", "未填"];

const questionnaires: Ref<QuestionnaireI[]> = ref([]);

const completed: Ref<QuestionnaireI[]> = ref([]);
const noCompleted: Ref<QuestionnaireI[]> = ref([])
// 总的减去已完成的就是未完成的
watchEffect(() => {
	const idSet = new Set();
	completed.value?.forEach((item) => {
		idSet.add(item.id);
	});
	const res: QuestionnaireI[] = [];
	questionnaires.value?.forEach((item) => {
		if (!idSet.has(item.id)) {
			res.push(item);
		}
	});
	noCompleted.value = res
})

onShow(async () => {
	const { execute: exeMe } = useQuery({ query: meGQL });
	const { execute: exeFindAllQ } = useQuery({ query: findAllQGQL });

	const { error: errMe, data: dataMe } = await exeMe();
	const { error: errFindAllQ, data: dataFindAllQ } = await exeFindAllQ();

	if (errMe) {
		uni.showToast({
			title: `获取已填写问卷失败: ${errMe}`,
			icon: "error",
			duration: 2000,
		});
		throw new Error(`获取已填写问卷失败: ${errMe}`);
	}
	console.log("dataMe: ", dataMe);
	completed.value = dataMe?.me.questionnairesAsOwnerAsFriend.map((item: any) => item.questionnaire) || [];
	// TODO 这里只查了拥有者，后面可以查填写者，把为朋友填写的也可以查出来
	if (errFindAllQ) {
		uni.showToast({
			title: `获取所有问卷失败: ${errFindAllQ}`,
			icon: "error",
			duration: 2000,
		});
		throw new Error(`获取所有问卷失败: ${errMe}`);
	}
	console.log("dataFindAllQ: ", dataFindAllQ);
	questionnaires.value = dataFindAllQ?.findAllQ || [];
});

function write(questionnaireId: string) {
	const userId = meStore.user?.id;
	uni.navigateTo({
		url: `/pages/questionnaire/write?questionnaireId=${questionnaireId}&ownerId=${userId}&friendId=${userId}`,
	});
}

function look(questionnaireId: string) {
	const userId = meStore.user?.id;
	// TODO 目前仅支持查看自己的，所以固定了friendId为自己，后续支持查看为朋友填写的
	uni.navigateTo({
		url: `/pages/questionnaire/look?questionnaireId=${questionnaireId}&ownerId=${userId}&friendId=${userId}`,
	});
}

onShareAppMessage((res: any) => {
	if (res.from === "button") {
		// 来自页面内分享按钮
		console.log("share target: ", res.target);
	}
	const userId = meStore.user?.id;
	const questionnaireId = res.target.dataset.data;
	return {
		title: "帮助好友填写问卷",
		path: `/pages/me/index?questionnaireId=${questionnaireId}&ownerId=${userId}&curScene=1`,
		imageUrl: logoUrl,
	};
});
</script>

<style lang="scss" scoped>
.no-data {
	padding-top: 60px;
}
</style>
