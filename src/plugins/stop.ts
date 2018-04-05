import { Client, Message, Collection, Member } from "eris";
import { Permission, Plugin } from "../parachute";

export default class Stop extends Plugin {
	readonly label: string = "stop";
	readonly permission: Permission = Permission.OWNER;
	readonly name: string = "Stop";

	constructor(client: Client) {
		super(client);
	}

	run(message: Message, args: string[] = []) {
		if (this.client) this.client.disconnect({ reconnect: false });
	}
}
