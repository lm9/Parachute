import { Client, Message, Member, Collection, VoiceState } from "eris";
import * as fs from "fs-extra";

namespace Parachute {
	export enum Permission {
		OWNER,
		ADMIN,
		USER
	}

	export class Keys {
		readonly data: any;
		readonly token: string;

		constructor(json: string, encoding: string = "utf8") {
			this.data = JSON.parse(fs.readFileSync(json, encoding));
			this.token = this.data["token"];
		}
	}

	export class Settings {
		readonly data: any;
		readonly owner: string;
		readonly prefix: string;

		constructor(json: string, encoding: string = "utf8") {
			this.data = JSON.parse(fs.readFileSync(json, encoding));
			this.owner = this.data["token"];
			this.prefix = this.data["prefix"];
		}
	}

	export class Parachute {
		private client: Client;
		private keys: Keys;
		private settings: Settings;

		constructor(keys_json: string, settings_json: string) {
			this.keys = new Keys(keys_json);
			this.settings = new Settings(settings_json);
			this.client = new Client(this.keys.token);
			this.setup();
		}

		// 実行
		run() {
			this.client.connect();
		}

		// コマンドの登録
		public register_command(module: any) {
			const pm: Plugin = new module(this.client);
			// 必要なのものがとりあえず揃っている
			if (!(pm.label && pm.name && pm.run)) return;
			this.client.on("messageCreate", async (message: Message) => {
				// Guildによって切り分けたりもしたいが
				switch (pm.permission) {
					case Permission.USER:
						break;
					case Permission.OWNER:
						if (message.author.id !== this.settings.owner) return;
						break;
					case Permission.ADMIN:
						// 特に今はないので
						break;
				}

				const args = this.command_match(message.content, pm.label);
				if (args) {
					pm.run(message, args);
				}
			});
			console.log(`Loaded module: ${pm.name}`);
		}

		// セットアップ
		private setup() {
			this.client.on("ready", () => {
				console.log(`Ready as ${this.client.user.username}#${this.client.user.discriminator}`);
			});
		}

		// コマンドのチェック
		private command_match(content: string, command: string): string[] | null {
			const args = content.split(/ +/);
			if (args[0] === `${this.settings.prefix}${command}`) {
				args.shift();
				return args;
			}
			return null;
		}
	}

	export abstract class Plugin {
		abstract readonly label: string;
		abstract readonly permission: Permission;
		abstract readonly name: string;
		protected client: Client;
		constructor(client: Client) {
			this.client = client;
		}
		abstract run(message: Message, args: string[]): void;
	}
}

export = Parachute;
