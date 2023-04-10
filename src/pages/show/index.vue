<template>
	<view class="show-container">
		<view class="questionnaire-select">
			<uni-data-select v-model="curValue" :localdata="range" @change="chooseQuestionnaire"></uni-data-select>
		</view>
		<view class="top-placeholder"></view>
		<view class="chart-container">
			<view v-if="showType === -1" class="no-data">
				<empty info="请先选择问卷"></empty>
			</view>
			<radar v-if="showType === 0"></radar>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import radar from "./components/radar.vue";
import { onShow } from "@dcloudio/uni-app";
import { useQuery } from "villus";
import { meGQL } from "@/graphql/questionnaire.graphql";
import type { QuestionnaireI } from "../questionnaire/questionnaire.interface";
import type { RangeI } from "./show.interface";
import empty from "@/components/empty.vue";

const questionnaires: Ref<QuestionnaireI[]> = ref([]);

// FIXME 这里在questionnaires被赋值更新后不执行
/*
const range = computed(() => {
	console.log(questionnaires.value);
	const arr = questionnaires.value.map((item) => ({
		value: item.id,
		text: item.title,
	}));
	console.log("show page computed: ", arr);
	return arr;
});
*/
const range: Ref<RangeI[]> = ref([]);

const curValue = ref();
const showType = ref(-1);

watch(questionnaires, (newVal) => {
	range.value = newVal.map((item) => ({
		value: item.id,
		text: item.title,
	}));
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
	questionnaires.value = data?.me.questionnairesAsOwner.map((item: any) => item.questionnaire) || [];
});

function chooseQuestionnaire(e: any) {
	showType.value = questionnaires.value.find((item) => item.id == e)?.type ?? -1;
}
</script>

<style lang="scss" scoped>
.show-container {
	.no-data {
		padding-top: 80px;
	}
}

.questionnaire-select {
	position: fixed;
	top: -1px;
	width: 100vw;
	background-color: #FFFFFF;
	z-index: 1000;
}

.top-placeholder {
	height: 50px;
	width: 100vw;
}
</style>
