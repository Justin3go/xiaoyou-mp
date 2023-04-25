import { createClient, fetch  } from "villus";

type Methods = "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT";

// 此处重写fetch，请求采用UniAPP提供的uni.request
const fetchPlugin = fetch({
	fetch(url, options) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: url.toString(),
				method: options?.method as Methods,
				data: options?.body as any,
				header: options?.headers,

				success(res) {
					resolve({
						ok: true,
						status: res.statusCode,
						headers: res.header,
						text: async () => JSON.stringify(res.data),
						json: async () => res.data,
					} as Response);
				},
				fail(e) {
					reject(e);
				},
			});
		});
	},
});

export const apolloClient = createClient({
	url: `${import.meta.env.VITE_SERVER_IP}/graphql`,
	use: [fetchPlugin],
});
