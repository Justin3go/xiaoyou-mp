/**
 * 获取字符串所占的宽度
 * @param value
 * @return 内容的长度
 */
export function getStringWidth(value: string): number {
	if (!value) {
		return 0;
	}
	const charCount = value.split("").reduce((prev, curr) => {
		// 英文字母和数字等算一个字符；这个暂时还不完善；
		if (/[a-z]|[0-9]|[,;.!@#-+/\\$%^*()<>?:"'{}~]/i.test(curr)) {
			return prev + 1;
		}
		// 其他的算是2个字符
		return prev + 2;
	}, 0);

	// 向上取整，防止出现半个字的情况
	return charCount;
}

/**
 * 省略超过规定长度的字符串
 * @param str 源字符串
 * @param len 长度阈值，超过该阈值就省略
 * @return 拼接后的字符串
 */
export function omitLongString(str: string, len: number): string {
	let curLen = 0;
	for (let i = 0; i < str.length; i++) {
		const item = str[i];
		if (/[a-z]|[0-9]|[,;.!@#-+/\\$%^*()<>?:"'{}~]/i.test(item)) {
			curLen += 1;
		} else curLen += 2;
		if (curLen >= len) {
			return str.substring(0, i + 1) + "...";
		}
	}
  return str;
}
