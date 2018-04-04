import { Client, Message, Collection, Member } from "eris";
import { Permission, ParachuteModule } from "../parachute";

export default class Info extends ParachuteModule {
  readonly label: string = "info";
  readonly permission: Permission = Permission.USER;
  readonly name: string = "Info";
  private waked_at: Date;

  constructor(client: Client) {
    super(client);
    this.waked_at = new Date();
  }

  public run(message: Message, args: string[] = []) {
    try {
      message.channel.createMessage(`
Parachute is a Noob Discord Bot.
Repository: https://github.com/lm9/Parachute
Woke at ${this.waked_at}
      `);
    } catch (e) {
      console.error(e);
    }
  }
}