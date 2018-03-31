import Parachute = require("./parachute");
import * as fs from "fs-extra";
import {Client, Message, Collection, Member} from "eris";

// parachute modules
import auto_grouping = require("./auto_grouping");
import ping_pong = require("./ping_pong");
import stop = require("./stop");

const keys = JSON.parse(fs.readFileSync('./confs/keys.json', 'utf8'))
const settings = JSON.parse(fs.readFileSync('./confs/settings.json', 'utf8'))

const token = keys["token"];
const owner = settings["owner"];
const prefix = settings["command_prefix"];

const parachute = new Parachute(token, owner, prefix);

// ループでやりてえなあこれ
parachute.register_command(auto_grouping.label, auto_grouping.command, auto_grouping.permission);
parachute.register_command(ping_pong.label, ping_pong.command, ping_pong.permission);
parachute.register_command(stop.label, stop.command, stop.permission);

export = parachute;