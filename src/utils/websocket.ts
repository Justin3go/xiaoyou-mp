import { getToken } from "./auth";

export class uniGqlWebsocket {
	private lockReconnect = false;
	private url: string = `${import.meta.env.VITE_SERVER_IP_WS}/graphql`;
	private subscription: string;
	private processMsg: (res: any) => void;

	private timeout: number = 3000; // 多少秒执行检测
	private timer: any = null;
	private reconnectTimer: any = null;

	private limitMax: number = 12;
	private limitCounter: number = 0;

	public socketTask: any;

	constructor(subscription: string, processMsg: (res: any) => void) {
		this.processMsg = processMsg;
		this.subscription = subscription;
		//心跳检测
		try {
			this.initRequest();
		} catch (err) {
			console.log("initRequest catch: ", err);
			this.reconnect();
		}
	}

	initRequest() {
		this.socketTask = uni.connectSocket({
			url: this.url, //接口地址。
			header: { Authorization: "Bearer " + getToken("accessToken") },
      protocols: ['graphql-ws'],
			success: () => {
				console.log("连接成功...");
        this.limitCounter = 0;
        // 开启检测
        this.start();
        this.socketTask.send({
          type: "subscribe",
          payload: {
            query: this.subscription,
          },
        });
			},
		});

		this.socketTask.onOpen((res: any) => {
			console.log("连接打开: ", res);
			// 清除重连定时器
			clearTimeout(this.reconnectTimer);
      this.limitCounter = 0;
			// 开启检测
			this.start();
			this.socketTask.send({
				type: "subscribe",
				payload: {
					query: this.subscription,
				},
			});
		});

		// 如果希望websocket连接一直保持，在close或者error上绑定重新连接方法。
		this.socketTask.onClose((res: any) => {
			console.log("连接关闭: ", res);
			this.reconnect();
		});

		this.socketTask.onError((res: any) => {
			console.log("连接错误: ", res);
			this.reconnect();
		});

		this.socketTask.onMessage((res: any) => {
			//接受任何消息都说明当前连接是正常的
			this.reset();
			console.log("pong: ", res);
			if (res?.type !== "pong") {
				this.processMsg(res);
			}
		});
	}

	// reset和start方法主要用来控制心跳的定时。
	reset() {
		// 清除定时器重新发送一个心跳信息
		clearTimeout(this.timer);
		this.start();
	}

	start() {
		this.timer = setTimeout(() => {
			//这里发送一个心跳，后端收到后，返回一个心跳消息，
			//onmessage拿到返回的心跳就说明连接正常
			console.log("send ping");
			this.socketTask.send({ type: "ping" });
		}, this.timeout);
	}

	// 重连
	reconnect() {
		// 防止多个方法调用，多处重连
		if (this.lockReconnect) {
			return;
		}
		this.lockReconnect = true;
		if (this.limitCounter < this.limitMax) {
			console.log("准备重连...");
			// 间隔5秒重试
			this.reconnectTimer = setTimeout(() => {
				// 重新连接
				this.initRequest();
				this.lockReconnect = false;
			}, 5000);
			this.limitCounter++;
		} else {
      this.socketTask.close({
        code: 1000,
        reason: "超过重试次数，关闭连接..."
      });
    }
	}
}
