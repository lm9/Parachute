import { Client, Message, Collection, Member, VoiceConnection } from "eris";
import { Permission, Plugin } from "../parachute";
import { join } from "path";

export default class Player extends Plugin {
	readonly label: string = "player";
	readonly permission: Permission = Permission.USER;
	readonly name: string = "Player";
	private voice_state: {
		[key: string]: VoiceConnection | null;
	} = {};

	constructor(client: Client, settings?: any, keys?: any) {
		super(client, settings, keys);
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
			default:
				break;
		}
	}

	private join_channel(message: Message) {
		if (
			!message.member ||
			!message.member.voiceState.channelID ||
			this.voice_state[message.member.voiceState.channelID] // 指定したチャンネルにすでに参加している
		)
			return;
		// 権限認証 (今はナシ)

		// ボイス接続
		this.client
			.joinVoiceChannel(message.member.voiceState.channelID)
			.then(voice_connection => {
				this.voice_state[voice_connection.channelID] = voice_connection;
			})
			.catch(e => console.log(e));
	}

	private async leave_channel(message: Message) {
		if (!message.member || !message.member.voiceState.channelID) return;
		if (!this.voice_state[message.member.voiceState.channelID]) return; // 指定したチャンネルに参加していない
		await this.client.leaveVoiceChannel(message.member.voiceState.channelID);
		this.voice_state[message.member.voiceState.channelID] = null;
	}

	private play(message: Message, song: string) {
		if (!message.member || !message.member.voiceState.channelID) return;
		if (!this.voice_state[message.member.voiceState.channelID]) return; // 指定したチャンネルに参加していない
		const channel_id = message.member.voiceState.channelID;
		const voice_connection = this.voice_state[channel_id];
		if (voice_connection) {
			voice_connection.play("./resources/1. Bon Bon Voyage! (Aiobahn Ver.).mp3");
		}
	}

	private stop(message: Message) {
		if (!message.member || !message.member.voiceState.channelID) return;
		if (!this.voice_state[message.member.voiceState.channelID]) return; // 指定したチャンネルに参加していない
		const channel_id = message.member.voiceState.channelID;
		const voice_connection = this.voice_state[channel_id];
		if (voice_connection) {
			voice_connection.stopPlaying();
		}
	}
}
