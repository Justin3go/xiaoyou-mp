<template>
	<view class="look-container">
		<view class="top-card">
			<uni-collapse-item :title="questionnaire.title">
				<view class="content">
					<text class="text">{{ questionnaire.description }}</text>
				</view>
			</uni-collapse-item>
		</view>
		<view class="top-card-placeholder"></view>
		<view class="questions-container" v-for="(question, qIndex) in questions" :key="question.id">
			<view class="question-item">
				<view class="description">{{ `${qIndex + 1}. ${question.description}` }}</view>
				<view class="options">
					<radio-group>
						<label class="radio" v-for="(option, oIndex) in question.options" :key="option">
							<view>
								<radio
									color="#0256FF"
									:disabled="true"
									:value="`${qIndex + 1}#${oIndex + 1}`"
									:checked="oIndex + 1 == result[qIndex + 1]"
								/>
							</view>
							<view>{{ option }}</view>
						</label>
					</radio-group>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { reactive, ref, type Ref } from "vue";
import { useQuery, useMutation } from "villus";
import { findOneQGQL, findOneU2QGQL } from "@/graphql/questionnaire.graphql";
import type { QuestionI } from "./questionnaire.interface";

const params = reactive({
	questionnaireId: "",
	ownerId: "",
	friendId: "",
});
const questions: Ref<QuestionI[]> = ref([]);
const questionnaire = reactive({
	title: "",
	description: "",
});

const result: Ref<any> = ref({});

onLoad(async (option) => {
	if (!option?.questionnaireId || !option?.ownerId || !option?.friendId) {
		uni.showToast({
			title: `页面参数有误`,
			icon: "error",
			duration: 3000,
		});
		throw new Error(
			`页面参数有误，无法正常加载: questionnaireId: ${option?.questionnaireId}; ownerId: ${option?.ownerId}; friendId: ${option?.friendId}`
		);
	}
	params.questionnaireId = option?.questionnaireId;
	params.ownerId = option?.ownerId;
	params.friendId = option?.friendId;
	await getQuestions(params.questionnaireId);
	await getResults();
});

async function getQuestions(questionnaireId: string) {
	const { execute } = useQuery({ query: findOneQGQL, variables: { questionnaireId }, paused: () => true });
	const { error, data } = await execute();

	if (error) {
		uni.showToast({
			title: `获取问题列表失败`,
			icon: "error",
			duration: 2000,
		});
		throw new Error(`获取问题列表失败: ${error}`);
	}
	questionnaire.title = data?.findOneQ.title;
	questionnaire.description = data?.findOneQ.description;
	questions.value = data?.findOneQ.questions?.map((item: any) => ({
		...item,
		options: item.options.split("#"),
	}));
	console.log("questions: ", questions.value);
}

async function getResults() {
	const { execute } = useQuery({ query: findOneU2QGQL, variables: { data: { ...params } }, paused: () => true });
	const { error, data } = await execute();
	console.log("get result error: ", error);

	if (error) {
		uni.showToast({
			title: `获取结果列表失败`,
			icon: "error",
			duration: 2000,
		});
		throw new Error(`获取结果列表失败: ${error}`);
	}
	console.log("get result data: ", data);

	result.value = JSON.parse(data?.findOneU2Q.result);
	console.log("result: ", result.value);
}
</script>
<style lang="scss" scoped>
.top-card {
	background-color: #ffffff;
	width: 100vw;

	position: fixed;
	top: -1px;
	z-index: 1000;

	box-shadow: 0px 2px 15px #dcdcdc;
	overflow: hidden;
	.content {
		padding: 15px;
	}

	.text {
		font-size: 16px;
		color: #666;
		line-height: 20px;
	}
}
.top-card-placeholder {
	height: 70px;
}
.questions-container {
	width: calc(100% - 40px);
	padding: 0 20px;
	margin-top: 15px;
	background-color: #ffffff;
	overflow: hidden;

	.description {
		font-size: 17px;
		font-weight: 900;
		color: $theme-color-light;
		margin: 20px 0;
	}
	.radio {
		color: $theme-color-dark;
		display: flex;
		height: 50px;
		line-height: 50px;
		border-top: 1px solid $theme-color-gray-lighter-1;
	}
}
.submit-container {
	overflow: hidden;
	height: 150px;
	width: 100vw;
	.submit-btn {
		margin: 50px 20vw;
		color: #ffffff;
		background-color: $theme-color-lighter-2;
		height: 60px;
		width: 60vw;
		line-height: 60px;
		text-align: center;
		border-radius: 30px;
	}
}
</style>
