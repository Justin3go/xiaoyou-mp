export interface UserInfoI {
	id: string;
	openId: string;
	createAt: string;
}

export interface loginAndAutoSignUpResI {
	accessToken: string;
	refreshToken: string;
	user: UserInfoI;
}
