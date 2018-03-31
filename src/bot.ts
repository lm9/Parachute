import { Parachute, Permission } from './parachute';
import * as fs from 'fs-extra';
import { Client, Message, Collection, Member } from 'eris';

const keys = JSON.parse(fs.readFileSync('./confs/keys.json', 'utf8'));
const settings = JSON.parse(fs.readFileSync('./confs/settings.json', 'utf8'));
const modules = JSON.parse(fs.readFileSync('./confs/modules.json', 'utf8'));

const token = keys['token'];
const owner = settings['owner'];
const prefix = settings['command_prefix'];

const parachute = new Parachute(token, owner, prefix);
modules.forEach((moduleFile: string) => {
  const parachuteModule: {label: string, command: Function, permission: Permission} = require(moduleFile);
  parachute.register_command(parachuteModule.label, parachuteModule.command, parachuteModule.permission);
});

export = parachute;
