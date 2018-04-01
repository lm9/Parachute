import { Parachute, Permission } from './parachute';
import * as fs from 'fs-extra';
import { Client, Message, Collection, Member } from 'eris';

const keys = JSON.parse(fs.readFileSync('./confs/keys.json', 'utf8'));
const settings = JSON.parse(fs.readFileSync('./confs/settings.json', 'utf8'));

const token = keys['token'];
const owner = settings['owner'];
const prefix = settings['command_prefix'];

const parachute = new Parachute(token, owner, prefix);

fs.readdir('./src/modules/', (err: NodeJS.ErrnoException, files: string[]) => {
  files.forEach((file: string) => {
    const m = file.match(/([a-z0-9_]+)\..{1,4}$/);
    if (m) {
      if (m[1] === 'ping_pong') return;
      const parachuteModule = require('./modules/' + m[1]);
      parachute.register_command(parachuteModule);
      console.log(`Loaded module: ${m[1]}`);
    }
  });
});

const ping_pong = require('./modules/ping_pong');
parachute.register_command_from_instance(ping_pong.label, ping_pong.command, ping_pong.permission);

export = parachute;
