import { Parachute, Permission } from './parachute';
import * as fs from 'fs-extra';
import { Client, Message, Collection, Member } from 'eris';

const keys = JSON.parse(fs.readFileSync('./confs/keys.json', 'utf8'));
const settings = JSON.parse(fs.readFileSync('./confs/settings.json', 'utf8'));

const token = keys['token'];
const owner = settings['owner'];
const prefix = settings['command_prefix'];

const parachute = new Parachute(token, owner, prefix);

const m = process.argv[1].match(/\.(.+)/);

if (m) {
  let modulesDir: string | null = null;
  switch (m[1]) {
    case 'js':
      modulesDir = './dist/modules/';
      break;
    case 'ts':
      modulesDir = './src/modules/';
      break;
    default:
      break;
  }
  if (modulesDir) {
    fs.readdir(modulesDir, (err: NodeJS.ErrnoException, files: string[]) => {
      files.forEach((file: string) => {
        const m = file.match(/([a-z0-9_]+)\..{1,4}$/);
        if (m) {
          const parachuteModule: {label: string, command: Function, permission: Permission} = require('./modules/' + m[1]);
          parachute.register_command(parachuteModule);
          
        }
      });
    });
  }
}

export = parachute;
