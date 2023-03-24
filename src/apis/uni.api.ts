/**
 * 登录
 *
 * http://uniapp.dcloud.io/api/plugins/login?id=login
 */
export function uniLogin(
	provider: "weixin" | "qq" | "sinaweibo" | "xiaomi" | "apple" | "univerify" | undefined
): Promise<UniApp.LoginRes> {
	return new Promise((resolve, reject) => {
		uni.login({
			provider,
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				reject(err);
			},
		});
	});
}

