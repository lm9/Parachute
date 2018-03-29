import Parachute = require("./parachute");
import * as fs from "fs";

const keys = JSON.parse(fs.readFileSync('./confs/keys.json', 'utf8'))
const settings = JSON.parse(fs.readFileSync('./confs/settings.json', 'utf8'))

const token = keys["token"];
const owner = settings["owner"];
const prefix = settings["command_prefix"];

const parachute = new Parachute(token, owner, prefix);

export = parachute;