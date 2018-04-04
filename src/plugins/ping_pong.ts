import { Client, Message, Collection, Member } from "eris";
import { Permission, Plugin } from "../parachute";

export default class PingPong extends Plugin {
	readonly label: string = "ping";
	readonly permission: Permission = Permission.USER;
	readonly name: string = "PingPong";
	private called_count: { [key: string]: number } = {};

	constructor(client: Client) {
		super(client);
	}

	public run(message: Message, args: string[] = []) {
		if (!this.called_count[message.channel.id]) {
			this.called_count[message.channel.id] = 0;
		}
		++this.called_count[message.channel.id];
		try {
			message.channel.createMessage("pong!");
			if (0 < args.length) {
				message.channel.createMessage(
					JSON.stringify({
						args: args,
						called_count: this.called_count[message.channel.id]
					})
				);
			}
		} catch (e) {
			console.error(e);
		}
	}
}
