<template>
  <view class="empty-container">
    <image :src="emptyUrl" mode="widthFix"></image>
    <view class="info">{{ props.info }}</view>
  </view>
</template>
<script setup lang="ts">
import { emptyUrl } from "@/const"

interface propsI {
  info: string;
}

const props = withDefaults(defineProps<propsI>(), {
  info: "暂无消息"
})
</script>
<style lang="scss" scoped>
.empty-container {
  margin: auto;
  width: 120px;
  image {
    width: 100%;
  }
  .info {
    text-align: center;
		color: #dbdbdb;
  }
}
</style>