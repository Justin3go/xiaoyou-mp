export interface RangeI {
	text: string;
	value: string;
	disable?: boolean;
}

export interface ListAsOwnerSourceDataI {
	friend: {
    id: string;
		nickName: string;
		avatarUrl: string;
	};
	visualization: string;
}

export interface FriendItemI {
	id: string;
	nickName: string;
	avatarUrl: string;
	visualization: number[];
	disabled: boolean;
}
