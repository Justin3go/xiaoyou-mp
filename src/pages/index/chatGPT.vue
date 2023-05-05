<template>
	<chat :type="chatType.chatGPT"></chat>
</template>
<script setup lang="ts">
import chat from '@/components/chat/chat.vue';
import { chatType } from "@/const/enum";
</script>
<style lang="scss" scoped></style>