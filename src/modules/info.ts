import { Client, Message, Collection, Member } from "eris";
import { Permission, ParachuteModule } from "../parachute";

export default class Info extends ParachuteModule {
  readonly label: string = "info";
  readonly permission: Permission = Permission.USER;
  readonly name: string = "Info";
  private called_count: { [key: string]: number } = {};

  constructor(client: Client) {
    super(client);
  }

  public run(message: Message, args: string[] = []) {
    try {
      message.channel.createMessage(`
Parachute is a Noob Discord Bot.
Repository: https://github.com/lm9/Parachute
      `);
    } catch (e) {
      console.error(e);
    }
  }
}