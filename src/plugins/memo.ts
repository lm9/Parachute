import { Client, Message } from "eris";
import { Permission, Plugin } from "../parachute";
import DiscordMemo from "./lib/discord_memo";

export = class Memo extends Plugin {
	readonly label: string = "memo";
	readonly permission: Permission = Permission.USER;
	readonly name: string = "Memo";
	private memo: DiscordMemo;

	constructor(client: Client, settings?: any, keys?: any) {
		super(client, settings, keys);
		this.memo = new DiscordMemo(this.settings["db"]);
	}

	public async run(message: Message, args: string[] = []) {
		if (!args) return; // 引数なし

		const new_memos: string[] = [];
		for (let i = 0; i < args.length; i++) {
			switch (args[i]) {
				case "-h":
					await this.help(message);
					break;
				case "-l":
					await this.list(message);
					break;
				case "-d":
					await this.delete(message, args[++i]);
					break;
				default:
					if (!args[i].startsWith("-")) await new_memos.push(args[i]);
					break;
			}
		}

		if (new_memos.length > 0) {
			this.memo.add(message.author.id, message.channel.id, new_memos);
		}
	}

	private help(message: Message) {
		message.channel
			.createMessage(
				`-l: List your memos
				-d <memo's id>: delete memo
				-h: This help`
			)
			.catch(e => console.error(e));
	}

	private async delete(message: Message, id: string) {
		await this.memo.remove(message.author.id, id);
	}

	private async list(message: Message) {
		const memo_list = await this.memo.list(message.author.id, message.channel.id);
		let response = "Your memos\n";
		for (const memo of memo_list) {
			response += `${memo.sentence} [${memo.id}]\n`;
		}
		message.channel.createMessage(response).catch(e => console.error(e));
	}
};
