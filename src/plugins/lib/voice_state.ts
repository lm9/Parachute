import * as Otogumo from "otogumo";
import { VoiceConnection, VoiceResourceOptions } from "eris";
export class Audio {
	readonly file: string; // ファイルへの相対パス
	readonly source: string; // SoundCloudへのリンク
	readonly track: Otogumo.Track; // トラック情報
	readonly options: VoiceResourceOptions;

	constructor(
		file: string,
		source: string,
		track: Otogumo.Track,
		options: VoiceResourceOptions = { inlineVolume: true }
	) {
		this.file = file;
		this.source = source;
		this.track = track;
		this.options = options;
	}
}

export class VoiceState {
	private queue: Audio[] = [];
	private voice_connection?: VoiceConnection;
	private continue?: boolean; // 連続再生用
	private nowplaying?: Audio;

	constructor(vc: VoiceConnection) {
		this.join(vc);
	}

	public join(vc: VoiceConnection) {
		this.voice_connection = vc;
	}

	public leave() {
		this.voice_connection = undefined;
		this.stop();
	}

	public isReady() {
		return this.voice_connection ? true : false;
	}

	public push(audio: Audio) {
		this.queue.push(audio);
		if (this.queue.length === 1 && this.voice_connection && !this.voice_connection.playing) {
			this.continue = true;
			this.play();
		}
	}

	public play() {
		if (!this.voice_connection) return; // voice_connectionがないとダメ
		this.nowplaying = this.queue.shift();
		if (!this.nowplaying) {
			this.continue = false;
			return; // queueに1件もなかったらダメです
		}
		this.voice_connection.play(this.nowplaying.file, this.nowplaying.options);
		this.voice_connection.on("end", () => {
			if (this.continue) this.play(); // 終わり次第連続再生
		});
	}

	public stop() {
		if (!this.voice_connection) return; // voice_connectionがないとダメ
		if (!this.voice_connection.playing) return; // 再生してないとダメ
		this.voice_connection.stopPlaying();
		this.continue = false;
	}

	public pause() {
		if (!this.voice_connection) return; // voice_connectionがないとダメ
		if (this.voice_connection.playing) this.voice_connection.pause(); // 再生中を判定してpause
	}

	public resume() {
		if (!this.voice_connection) return; // voice_connectionがないとダメ
		if (this.voice_connection.paused) this.voice_connection.resume(); // pause中を判定してresume
	}

	public last() {
		// 連続再生を停止
		this.continue = false;
	}

	public start() {
		// 連続再生を再開
		this.continue = true;
	}

	public getNowplayingTrack() {
		if (!this.voice_connection || !this.voice_connection.playing || !this.nowplaying) return false;
		return this.nowplaying.track;
	}

	public getQueue() {
		const queue: Otogumo.Track[] = [];
		for (const audio of this.queue) {
			queue.push(audio.track);
		}
		return queue;
	}

	public clear() {
		this.queue = [];
	}

	public setVolume(volume: number) {
		if (!this.voice_connection) return; // voice_connectionがないとダメ
		this.voice_connection.setVolume(volume);
	}

	public getVolume() {
		if (!this.voice_connection) return; // voice_connectionがないとダメ
		return this.voice_connection.volume;
	}
}
