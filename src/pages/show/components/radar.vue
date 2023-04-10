<template>
	<view class="charts-box">
		<qiun-data-charts type="radar" :opts="opts" :chartData="chartData" />
	</view>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import qiunDataCharts from "@/components/qiun-data-charts/qiun-data-charts.vue";
import { onReady } from "@dcloudio/uni-app";

const chartData = ref({});
const opts = {
	timing: "easeOut",
	duration: 1000,
	rotate: false,
	rotateLock: false,
	color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
	padding: [5, 5, 5, 5],
	fontSize: 13,
	fontColor: "#666666",
	dataLabel: false,
	dataPointShape: true,
	dataPointShapeType: "solid",
	touchMoveLimit: 60,
	enableScroll: false,
	enableMarkLine: false,
	legend: {
		show: true,
		position: "right",
		lineHeight: 25,
		float: "center",
		padding: 5,
		margin: 5,
		backgroundColor: "rgba(0,0,0,0)",
		borderColor: "rgba(0,0,0,0)",
		borderWidth: 0,
		fontSize: 13,
		fontColor: "#666666",
		hiddenColor: "#CECECE",
		itemGap: 10,
	},
	extra: {
		radar: {
			gridType: "radar",
			gridColor: "#CCCCCC",
			gridCount: 3,
			opacity: 0.2,
			max: 200,
			labelShow: true,
			gridEval: 1,
			radius: 0,
			axisLabel: false,
			axisLabelTofix: 0,
			labelColor: "#666666",
			labelPointShow: false,
			labelPointRadius: 3,
			labelPointColor: "#CCCCCC",
			border: false,
			borderWidth: 2,
			linearType: "none",
		},
		tooltip: {
			showBox: true,
			showArrow: true,
			showCategory: false,
			borderWidth: 0,
			borderRadius: 0,
			borderColor: "#000000",
			borderOpacity: 0.7,
			bgColor: "#000000",
			bgOpacity: 0.7,
			gridType: "solid",
			dashLength: 4,
			gridColor: "#CCCCCC",
			boxPadding: 3,
			fontSize: 13,
			lineHeight: 20,
			fontColor: "#FFFFFF",
			legendShow: true,
			legendShape: "auto",
			splitLine: true,
			horizentalLine: false,
			xAxisLabel: false,
			yAxisLabel: false,
			labelBgColor: "#FFFFFF",
			labelBgOpacity: 0.7,
			labelFontColor: "#666666",
		},
	},
};

onReady(() => {
	getServerData();
});

function getServerData() {
	//模拟从服务器获取数据时的延时
	setTimeout(() => {
		//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
		let res = {
			categories: ["神经质", "外向型", "开放性", "宜人性", "尽责性"],
			series: [
				{
					name: "自己",
					data: [90, 110, 165, 195, 187],
				},
				{
					name: "朋友1",
					data: [190, 210, 105, 35, 27],
				},
        {
					name: "朋友2",
					data: [90, 20, 155, 135, 27],
				},
			],
		};
		chartData.value = JSON.parse(JSON.stringify(res));
	}, 500);
}
</script>
<style lang="scss" scoped>
  .charts-box {
    background-color: #FFFFFF;
    width: 100vw;
    height: 300px;
  }
</style>
