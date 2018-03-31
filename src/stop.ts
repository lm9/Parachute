import { Client, Message, Collection, Member } from 'eris';
import { Permission } from './parachute';

function stop(client: Client, message: Message) {
  client.disconnect({ reconnect: false });    
}

export = { label: 'stop', command: stop, permission: Permission.OWNER };
