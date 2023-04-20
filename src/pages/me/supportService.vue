<template>
  <view class="support-service-container">
    <image :src="wxMoney" mode="widthFix"></image>
    <view class="info">请作者喝杯☕~</view>
  </view>
</template>
<script setup lang="ts">
import { wxMoney } from '@/const';
</script>
<style lang="scss" scoped>
.support-service-container {
  image {
    width: 100vw;
  }
  .info {
    margin-top: 20px;
    text-align: center;
    color: $theme-color-gray;
  }
}
</style>