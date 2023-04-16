<template>
	<view class="write-container">
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
					<radio-group @change="radioChange">
						<label class="radio" v-for="(option, oIndex) in question.options" :key="option">
							<view>
								<radio
									color="#0256FF"
									:value="`${qIndex + 1}#${oIndex + 1}`"
									:checked="oIndex + 1 === result[qIndex + 1]"
								/>
							</view>
							<view>{{ option }}</view>
						</label>
					</radio-group>
				</view>
			</view>
		</view>
		<view v-show="questions.length" class="submit-container">
			<button class="submit-btn" @click="submit">提交</button>
		</view>
	</view>
</template>
<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { reactive, ref, type Ref } from "vue";
import { useQuery, useMutation } from "villus";
import { findOneQGQL, isExistedGQL, writeGQL } from "@/graphql/questionnaire.graphql";
import type { QuestionI } from "./questionnaire.interface";
import { useMeStore } from "@/stores/me.store";

const meStore = useMeStore();

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

const result: Ref<number[]> = ref([]);

onLoad(async (option) => {
	if (!option?.questionnaireId || !option?.ownerId) {
		uni.showToast({
			title: `页面参数有误，无法正常加载: questionnaireId: ${option?.questionnaireId}; ownerId: ${option?.ownerId}`,
			icon: "error",
			duration: 3000,
		});
		throw new Error("页面参数有误");
	}
	params.questionnaireId = option?.questionnaireId;
	params.ownerId = option?.ownerId;
	// 如果上个页面没有传递朋友(填写者)ID，就使用当前页面的全局用户ID，在分享给好友填写时极其有作用
	params.friendId = option?.friendId || meStore.user?.id;
	// TODO 检测该链接是否已经填写过
	if (await isExisted()) {
		console.log("已经填写过该问卷了");
		// 帮助好友填写都是从登录页过来的，所以这里直接返回登录页面
		uni.navigateBack({
			delta: 1,
			success: () => {
				uni.showToast({
					title: "已填写该问卷",
					icon: "error",
					duration: 2000,
				});
			},
		});
	}
	await getQuestions(params.questionnaireId);
});

async function getQuestions(questionnaireId: string) {
	const { execute } = useQuery({ query: findOneQGQL, variables: { questionnaireId } });
	uni.showLoading({ title: "正在加载问题列表" });
	const { error, data } = await execute();

	if (error) {
		uni.showToast({
			title: `获取问题列表失败: ${error}`,
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

async function isExisted() {
	const { execute } = useQuery({ query: isExistedGQL, variables: { data: { ...params } } });
	uni.showLoading({ title: "正在校验中" });
	const { error, data } = await execute();

	if (error) {
		uni.showToast({
			title: `校验请求失败: ${error}`,
			icon: "error",
			duration: 2000,
		});
		throw new Error(`校验请求失败: ${error}`);
	}
	console.log("isExisted error: ", error);
	console.log("isExisted data: ", data);

	const isExisted: boolean = data?.isExisted;
	return isExisted;
}

function radioChange(e: any) {
	const [qIndex, oIndex] = e.detail.value.split("#");
	result.value[qIndex] = oIndex;
}

async function submit() {
	console.log("result: ", result.value);
	// TODO 校验是否填写完全
	const len = questions.value.length;
	const resultObj: any = {};

	for (let i = 1; i < len + 1; i++) {
		const item = result.value[i];
		if (item === undefined) {
			uni.showToast({
				title: `NO.${i}题目未填写`,
				icon: "error",
				duration: 2000,
			});
			return;
		}
		resultObj[i] = item;
	}

	const { execute } = useMutation(writeGQL);
	uni.showLoading({ title: "正在提交数据中" });
	const { error } = await execute({
		data: {
			...params,
			result: JSON.stringify(resultObj),
		},
	});
	console.log("submit error: ", error);
	if (error) {
		uni.showToast({
			title: `提交问卷失败: ${error}`,
			icon: "error",
			duration: 2000,
		});
		throw new Error(`提交问卷失败: ${error}`);
	}
	uni.navigateBack({
		delta: 1,
	});
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
