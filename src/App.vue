<script setup lang="ts">
import { onShow, onHide, onReady } from "@dcloudio/uni-app";

onReady(async () => {
	console.log("App Ready");
	
});
onShow(async () => {
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
	height: 50px !important;
	line-height: 50px !important;

	.uni-select__input-text {
		font-size: 16px !important;
	}
}
</style>
