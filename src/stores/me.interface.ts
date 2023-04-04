export interface UserInfoI {
	id: string;
	openId: string;
	createAt: string;
	avatarUrl: string;
	nickName: string;
	gender: string;
	province: string;
	birthday: string;
}

export interface loginAndAutoSignUpResI {
	accessToken: string;
	refreshToken: string;
	user: UserInfoI;
}
