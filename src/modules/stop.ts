import { Client, Message, Collection, Member } from "eris";
import { Permission, ParachuteModule } from "../parachute";

export default class Stop implements ParachuteModule{
  readonly label: string = "stop";
  readonly permission: Permission = Permission.OWNER;
  readonly name: string = "Stop";
  private client?: Client;

  run(message: Message, args: string[] = []) {
    if (this.client) this.client.disconnect({ reconnect: false });
  }

  setup(client: Client) {
    this.client = client;
  }

}