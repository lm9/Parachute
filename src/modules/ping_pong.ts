import { Client, Message, Collection, Member } from 'eris';
import { Permission, ParachuteModule } from '../parachute';

class PingPong implements ParachuteModule{
  readonly name: string = 'PingPong';
  private called_count: number = 0;
  constructor() {
    this.called_count = 0;
  }
  public run(client: Client, message: Message, args: string[] = []) {
    ++this.called_count;
    try {
      message.channel.createMessage('pong!');
      if (0 < args.length) {
        message.channel.createMessage(JSON.stringify({args: args, called_count: this.called_count}));
      }
    } catch (e) {
      console.error(e);
    }
  }
}

export = { label: 'ping', command: new PingPong(), permission: Permission.USER };