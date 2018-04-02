import { Client, Message, Collection, Member } from "eris";
import { Permission } from "../parachute";

function stop(client: Client, message: Message, args: string[] = []) {
  client.disconnect({ reconnect: false });
}

export = { label: "stop", command: stop, permission: Permission.OWNER };
