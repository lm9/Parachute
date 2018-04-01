import { Client, Message, Collection, Member } from 'eris';
import { Permission } from '../parachute';

function ping_pong(client: Client, message: Message, args: string[] = []) {
  try {
    message.channel.createMessage('pong!');
    if (0 < args.length) {
      message.channel.createMessage(JSON.stringify(args));
    }
  } catch (e) {
    console.error(e);
  }
}

export = { label: 'ping', command: ping_pong, permission: Permission.USER };
