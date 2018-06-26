import { Client, Message } from "eris";
import { Permission, Plugin } from "../parachute";
import * as Otogumo from "otogumo";
import fs from "fs-extra";
import { VoiceState, Audio } from "./lib/voice_state";

export = class Player extends Plugin {
	readonly label: string = "player";
	readonly permission: Permission = Permission.USER;
	readonly name: string = "Player";
	private states: {
		[key: string]: VoiceState;
	} = {};
	private otogumo: Otogumo.Client;
	readonly cache: string; // キャッシュを突っ込んでおくディレクトリ
	private default_volume: number;
	readonly inline_volume: boolean;

	constructor(client: Client, settings?: any, keys?: any) {
		super(client, settings, keys);
		this.otogumo = new Otogumo.Client(this.keys["client_id"], this.keys["client_secret"]);
		this.cache = this.settings.cache;
		this.default_volume = this.settings.default_volume ? this.settings.default_volume : 0.01;
		this.inline_volume = this.settings.inline_volume ? this.settings.inline_volume : false;
	}

	public run(message: Message, args: string[] = []) {
		switch (args[0]) {
			case "join":
				this.join_channel(message);
				break;
			case "leave":
				this.leave_channel(message);
				break;
			case "play":
				this.play(message, args[1]);
				break;
			case "stop":
				this.stop(message);
				break;
			case "pause":
				this.pause(message);
				break;
			case "resume":
				this.resume(message);
				break;
			case "start":
				this.start(message);
				break;
			case "last":
				this.last(message);
				break;
			case "queue":
				this.getQueue(message);
				break;
			case "clear":
				this.clear(message);
				break;
			case "np":
			case "nowplaying":
				this.getNowplaying(message);
				break;
			case "volume":
			case "vol":
				this.setVolume(message, Number(args[1]));
				break;
			default:
				break;
		}
	}

	private join_channel(message: Message) {
		if (!message.member || !message.member.voiceState.channelID) return;
		if (this.getState(message.member.voiceState.channelID) === 1) return; //準備済
		// 権限認証 (今はナシ)

		// ボイス接続
		this.client
			.joinVoiceChannel(message.member.voiceState.channelID)
			.then(voice_connection => {
				voice_connection.setVolume(this.default_volume);
				Player.log(`Now volume => ${voice_connection.volume}`);
				this.states[voice_connection.channelID] = new VoiceState(voice_connection);
			})
			.catch(e => console.log(e));
	}

	private async leave_channel(message: Message) {
		if (!message.member || !message.member.voiceState.channelID) return;
		if (this.getState(message.member.voiceState.channelID) < 1) return; // 未準備以下
		await this.client.leaveVoiceChannel(message.member.voiceState.channelID);
		this.states[message.member.voiceState.channelID].leave();
	}

	private async play(message: Message, audio_url: string) {
		if (!message.member || !message.member.voiceState.channelID) return;
		if (this.getState(message.member.voiceState.channelID) < 1) return; // 未準備以下
		const channel_id = message.member.voiceState.channelID;

		// サンクラからのダウンロードを開始
		// 元のURLからtrackのidを逆引きして
		const track_id = await this.otogumo.resolveUrl(audio_url);
		// track情報引っ張って
		const track = await this.otogumo.getTrack(track_id);
		// streamableじゃなかったら諦めて
		if (!track.streamable) return;
		// mp3として落とし込む（ここmp3固定でいいのかな？）
		const file = `${this.cache}soundcloud-${track.id}.mp3`;
		try {
			fs.statSync(file);
			this.states[channel_id].push(new Audio(file, audio_url, track));
		} catch (e) {
			this.otogumo.download(track.stream_url, file).on("close", () => {
				Player.log(`Downloaded ${track.stream_url}`);
				this.states[channel_id].push(new Audio(file, audio_url, track, { inlineVolume: this.inline_volume }));
			});
		}
	}

	private stop(message: Message) {
		if (!message.member || !message.member.voiceState.channelID) return;
		if (this.getState(message.member.voiceState.channelID) < 1) return; // 指定したチャンネルに参加していない
		const channel_id = message.member.voiceState.channelID;
		this.states[channel_id].stop();
	}

	private pause(message: Message) {
		if (!message.member || !message.member.voiceState.channelID) return;
		if (this.getState(message.member.voiceState.channelID) < 1) return; // 指定したチャンネルに参加していない
		const channel_id = message.member.voiceState.channelID;
		this.states[channel_id].pause();
	}

	private resume(message: Message) {
		if (!message.member || !message.member.voiceState.channelID) return;
		if (this.getState(message.member.voiceState.channelID) < 1) return; // 指定したチャンネルに参加していない
		const channel_id = message.member.voiceState.channelID;
		this.states[channel_id].resume();
	}

	private last(message: Message) {
		if (!message.member || !message.member.voiceState.channelID) return;
		if (this.getState(message.member.voiceState.channelID) < 1) return; // 指定したチャンネルに参加していない
		const channel_id = message.member.voiceState.channelID;
		this.states[channel_id].last();
	}

	private start(message: Message) {
		if (!message.member || !message.member.voiceState.channelID) return;
		if (this.getState(message.member.voiceState.channelID) < 1) return; // 指定したチャンネルに参加していない
		const channel_id = message.member.voiceState.channelID;
		this.states[channel_id].start();
	}

	private getNowplaying(message: Message) {
		if (!message.member || !message.member.voiceState.channelID) return;
		if (this.getState(message.member.voiceState.channelID) < 1) return; // 指定したチャンネルに参加していない
		const channel_id = message.member.voiceState.channelID;
		const np = this.states[channel_id].getNowplayingTrack();
		if (np) {
			message.channel
				.createMessage(`[Player] Nowplaying: ${np.user.username} - ${np.title} ${np.permalink_url}`)
				.catch(e => Player.log(e));
		}
	}

	private getQueue(message: Message) {
		if (!message.member || !message.member.voiceState.channelID) return;
		if (this.getState(message.member.voiceState.channelID) < 1) return; // 指定したチャンネルに参加していない
		const channel_id = message.member.voiceState.channelID;
		let mes = "In queue\n";
		for (const track of this.states[channel_id].getQueue()) {
			mes += `${track.title}\n`;
		}
		message.channel
			.createMessage(mes === "In queue\n" ? "キューには何も残っていません" : mes)
			.catch(e => Player.log(e));
	}

	private clear(message: Message) {
		if (!message.member || !message.member.voiceState.channelID) return;
		if (this.getState(message.member.voiceState.channelID) < 1) return; // 指定したチャンネルに参加していない
		const channel_id = message.member.voiceState.channelID;
		this.states[channel_id].clear();
	}

	private setVolume(message: Message, volume: number) {
		if (!message.member || !message.member.voiceState.channelID) return;
		if (this.getState(message.member.voiceState.channelID) < 1) return; // 指定したチャンネルに参加していない
		const channel_id = message.member.voiceState.channelID;
		this.states[channel_id].setVolume(volume);
		Player.log(`Now volume => ${this.states[channel_id].getVolume()}`);
	}

	private getState(channel_id: string) {
		if (!this.states[channel_id]) return -1; // not set
		if (this.states[channel_id].isReady())
			return 1; // ready
		else return 0; // 未準備
	}
	private static log(text: string) {
		console.log(`[Player] ${text}`);
	}
};
