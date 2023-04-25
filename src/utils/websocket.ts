import { getToken } from "./auth";

export class uniWebSocket {
	private socketTask: null | UniApp.SocketTask;
	public readyState: number = 0;
	public onOpen = (e: any) => {};
	public onClose = (e: any) => {};
	public onError = (e: any) => {};
	public onMessage = (e: any) => {};

	constructor(url: string, protocol: string) {
		const socketTask = uni.connectSocket({
			url,
			protocols: [protocol],
			header: { Authorization: "Bearer " + getToken("accessToken") },
			complete: () => {},
		});
		this.socketTask = socketTask;
		if (!this.socketTask) {
			throw new Error("server didn't accept Websocket");
		}
		this.init();
	}
	static CONNECTING = 0;
	static OPEN = 1;
	static CLOSING = 2;
	static CLOSED = 3;

	private init() {
		if (this.socketTask === null) throw new Error("uniWebSocket not init");
		this.socketTask.onOpen((e: any) => {
			console.log("websocket open: ", e);
			this.readyState = 1;
			this.onOpen(e);
		});
		this.socketTask.onError((e: any) => {
			console.log("websocket error: ", e);
			this.readyState = 1;
			this.onError(e);
		});
		this.socketTask.onClose((e: any) => {
			console.log("websocket close: ", e);
			this.readyState = 2;
			this.onClose(e);
			this.readyState = 3;
		});
		this.socketTask.onMessage((e: any) => {
			console.log("websocket message: ", e);
			this.readyState = 1;
			this.onMessage(e);
		});
	}

	public addEventListener(type: "open" | "error" | "close" | "message", callback: (event: any) => void) {
		if (type === "open") {
			this.onOpen = callback;
		} else if (type === "error") {
			this.onError = callback;
		} else if (type === "close") {
			this.onClose = callback;
		} else if (type === "message") {
			this.onMessage = callback;
		}
	}

	public send(msg: string) {
		if (this.socketTask === null) throw new Error("uniWebSocket not init");
		this.socketTask.send({ data: msg });
	}
	public close(code: number, reason: string) {
		if (this.socketTask === null) throw new Error("uniWebSocket not init");
		this.socketTask.close({ code, reason });
	}
}
