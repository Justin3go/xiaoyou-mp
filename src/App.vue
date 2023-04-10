<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
	console.log("App Launch");
});
onShow(() => {
	console.log("App Show");
});
onHide(() => {
	console.log("App Hide");
});
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
	height: 60px !important;
	line-height: 60px !important;

	.uni-select__input-text {
		font-size: 18px !important;
		font-weight: 900 !important;
	}
}
</style>
