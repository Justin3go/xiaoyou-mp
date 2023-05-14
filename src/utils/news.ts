import type { newsI } from "@/pages/index/index.interface";

export function getNews(): newsI[] {
	const news = uni.getStorageSync("news");
	if (!news) return [];
	else return JSON.parse(news);
}

export function setNews(value: newsI[]) {
	return uni.setStorageSync("news", JSON.stringify(value));
}
