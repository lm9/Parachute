import { Client, Message, Collection, Member } from "eris";
import { Permission, Plugin } from "../parachute";

export default class System extends Plugin {
	readonly label: string = "system";
	readonly permission: Permission = Permission.OWNER;
	readonly name: string = "System";

	constructor(client: Client, settings?: any, keys?: any) {
		super(client, settings, keys);
	}

	run(message: Message, args: string[] = []) {
		switch (args[0]) {
			case "stop":
				this.client.emit("endOnPlugin");
				break;
			default:
				break;
		}
	}
}
