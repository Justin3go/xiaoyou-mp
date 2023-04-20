<template>
	<view class="update-user-container">
		<one-row-card>
			<template #left>头像</template>
			<template #rightText>
				<image
					class="avatar"
					style="width: 50px; border-radius: 25px"
					mode="widthFix"
					:src="user.avatarUrl || userDefaultData.avatarUrl"
				></image>
			</template>
			<template #rightIcon>
				<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					<uni-icons type="forward" size="30" color="#D3D3D3"></uni-icons>
				</button>
			</template>
		</one-row-card>

		<one-row-card :right-text-width="'60px'">
			<template #left>昵称</template>
			<template #rightText>
				<input type="nickname" placeholder="新用户" v-model="user.nickName" @blur="handleNickNameChange" />
			</template>
			<template #rightIcon>
				<uni-icons type="compose" size="30" color="#D3D3D3"></uni-icons>
			</template>
		</one-row-card>

		<one-row-card>
			<template #left>性别</template>
			<template #rightText>{{ user.gender || userDefaultData.gender }}</template>
			<template #rightIcon>
				<picker mode="selector" :range="genderRange" :value="user.gender" @change="bindGenderChange">
					<uni-icons type="forward" size="30" color="#D3D3D3"></uni-icons>
				</picker>
			</template>
		</one-row-card>

		<one-row-card>
			<template #left>城市</template>
			<template #rightText>{{ user.province || userDefaultData.province }}</template>
			<template #rightIcon>
				<picker mode="selector" :range="provinceRange" :value="user.province" @change="bindProvinceChange">
					<uni-icons type="forward" size="30" color="#D3D3D3"></uni-icons>
				</picker>
			</template>
		</one-row-card>

		<one-row-card>
			<template #left>生日</template>
			<template #rightText>
				<view>{{ user.birthday || userDefaultData.birthday }}</view>
			</template>
			<template #rightIcon>
				<picker mode="date" :value="user.birthday" @change="bindDateChange">
					<uni-icons type="forward" size="30" color="#D3D3D3"></uni-icons>
				</picker>
			</template>
		</one-row-card>

		<view class="save" @click="save"> 保存修改 </view>
		<view class="logout" @click="logout"> 退出登录 </view>
	</view>
</template>
<script setup="props, context" lang="ts">
import oneRowCard from "@/components/oneRowCard.vue";
import { reactive } from "vue";
import { useMeStore } from "@/stores/me.store";
import { ossHost, provincesInChina, userDefaultData } from "@/const";
import { useMutation, useQuery } from "villus";
import { getPostObjectParamsGQL, updateUserGQL } from "@/graphql/me.graphql";
import { uniUploadFile } from "@/apis/uni.api";
import type { UserInfoI } from "@/stores/me.interface";
import { isValidKey } from "@/utils/typescript";
import { getStringWidth } from "@/utils/string";

const meStore = useMeStore();

// 登录之后才能进入这个页面
const userData = meStore.user as UserInfoI;

// 这里用user暂存当前页面修改的数据，而非直接在view中使用meStore中的数据
// userData不登录是null，登录后某些字段也可能有空数据
const user = reactive({
	avatarUrl: userData.avatarUrl,
	nickName: userData.nickName,
	gender: userData.gender,
	province: userData.province,
	birthday: userData.birthday,
});

const genderRange = ["男", "女", "其他"];
const provinceRange = provincesInChina;

function onChooseAvatar(e: any) {
	console.log("choose avatar: ", e.detail);
	user.avatarUrl = e.detail.avatarUrl;
}

function bindGenderChange(e: any) {
	user.gender = genderRange[e.detail.value];
}
// https://ask.dcloud.net.cn/question/150552
function handleNickNameChange(e: any) {
	user.nickName = e.detail.value;
}

function bindProvinceChange(e: any) {
	user.province = provinceRange[e.detail.value];
}

function bindDateChange(e: any) {
	user.birthday = e.detail.value;
}

async function save() {
	// 昵称不能超过10个字符 // FIXME 后端同样应该做限制
	const len = getStringWidth(user.nickName)
	console.log("nickName len: ", len);
	
	if (len > 10 || len === 0) {
		uni.showToast({
			title: "昵称长度错误",
			icon: "error",
			duration: 2000,
		});
		throw new Error("昵称长度错误");
	}

	if (userData.avatarUrl !== user.avatarUrl) {
		// 图片需要先上传oss
		const ossAvatarUrl = await uploadAvatar(user.avatarUrl);
		user.avatarUrl = ossAvatarUrl;
	}

	// TODO delete any
	const userParams: any = {};
	// 判断哪些属性用户进行了更新
	Object.entries(user).forEach(([key, val]) => {
		if (isValidKey(key, userData)) {
			if (userData[key] !== val) {
				// 说明这个属性需要更新
				userParams[key] = val;
			}
		}
	});

	console.log("userParams: ", userParams);

	const { execute } = useMutation(updateUserGQL);
	const { error, data } = await execute({ data: userParams });
	console.log("user update error: ", error);
	console.log("user update data: ", data);

	if (error) {
		uni.showToast({
			title: `保存修改失败: ${error}`,
			icon: "error",
			duration: 2000,
		});
		throw new Error(`保存修改失败: ${error}`);
	}
	// 成功修改后传递给pinia store
	meStore.$patch({ user: { ...userData, ...user } });
	uni.navigateBack({
		delta: 1,
	});
}

// 上传头像，规定头像的文件大小不能超过1mb
async function uploadAvatar(filePath: string) {
	// 1. 请求服务端签名凭证
	const { execute } = useMutation(getPostObjectParamsGQL);
	const { error, data } = await execute();
	if (error) {
		uni.showToast({
			title: `上传头像失败: ${error}`,
			icon: "error",
			duration: 2000,
		});
		throw new Error(`上传头像失败: ${error}`);
	}

	// 2. 上传图片至oss
	const { OSSAccessKeyId, policy, signature } = data?.getPostObjectParams || {};

	const imgType = filePath.split(".").pop();
	const key = `wxmp/${userData?.id}/${new Date().getTime()}.${imgType}`;
	const ossRes = await uniUploadFile({
		url: ossHost, // 开发者服务器的URL。
		filePath,
		name: "file", // 必须填file。
		formData: {
			key,
			policy,
			OSSAccessKeyId,
			signature,
		},
	});
	uni.hideLoading();

	return ossHost + "/" + key;
}

function logout() {}
</script>
<style lang="scss" scoped>
.update-user-container {
	.save {
		color: $uni-color-primary;
		width: 100vw;
		height: 68px;
		margin-top: 20px;
		background-color: #ffffff;
		line-height: 68px;
		text-align: center;
	}

	.logout {
		color: $uni-text-color-disable;
		width: 100vw;
		height: 68px;
		background-color: transparent;
		line-height: 68px;
		text-align: center;
		font-size: 13px;
	}

	.avatar-wrapper {
		padding-left: 0;
		padding-right: 0;
		height: 50px;
		line-height: 50px;
		background-color: transparent;
		border-color: transparent;
	}

	.avatar-wrapper::after {
		border: none;
	}

	.picker-container {
		padding-right: 50px;
	}
}
</style>
