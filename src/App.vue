<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { meGQL } from "@/graphql/me.graphql";
import { useMeStore } from "@/stores/me.store";
import { useMutation } from "villus";

const meStore = useMeStore();

onLaunch(async () => {
	console.log("App Launch");
	await getUser();
});
onShow(() => {
	console.log("App Show");
});
onHide(() => {
	console.log("App Hide");
});

async function getUser() {
	const { execute } = useMutation(meGQL);
	uni.showLoading({ title: "正在查询中..." });
	const { data, error } = await execute();
	console.log("query user data: ", data);
	console.log("query user error: ", error);
	meStore.$patch({ user:  data.me})
}
</script>
<style lang="scss">
page {
	background-color: $theme-color-background;
}
// questionnaire/write
.uni-collapse-item__title-box {
	height: 60px !important;
	line-height: 60px !important;
}
.uni-collapse-item__title-text {
	font-size: 18px !important;
	font-weight: 900;
}
// show/index
.uni-select {
	height: 50px !important;
	line-height: 50px !important;

	.uni-select__input-text {
		font-size: 16px !important;
	}
}
</style>
