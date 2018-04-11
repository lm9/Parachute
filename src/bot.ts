import { Parachute, Permission } from "./parachute";
import * as fs from "fs-extra";
import { Client, Message, Collection, Member } from "eris";

const parachute = new Parachute("./confs/keys.json", "./confs/settings.json");

fs.readdir("./src/plugins/", (err: NodeJS.ErrnoException, files: string[]) => {
	files.forEach((file: string) => {
		const m = file.match(/([a-z0-9_]+)\..{1,4}$/);
		if (m) {
			import("./plugins/" + m[1]).then(plugin => {
				parachute.register_command(plugin.default);
			});
		}
	});
});

export = parachute;
