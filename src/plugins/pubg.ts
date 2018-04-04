import { Client, Message, Collection, Member } from "eris";
import { Permission, Plugin } from "../parachute";
import * as PUBGAPI from "./lib/pubgapi/client";
import { readFileSync, read } from "fs-extra";

export default class PUBG extends Plugin {
  readonly label: string = "pubg";
  readonly permission: Permission = Permission.USER;
  readonly name: string = "PUBG";
  readonly pubgclient: PUBGAPI.Client;

  constructor(client: Client) {
      super(client);
      const key:string = JSON.parse(readFileSync("./confs/keys.json", "utf8"))["plugins"]["PUBG"]["API_KEY"];
      this.pubgclient = new PUBGAPI.Client(key);
  }

  public run(message: Message, args: string[] = []) {
      if (args.length < 1) {
          return;
      } else {
		  if (args[0] === "lookup" && args[1]) {
			  const region = "pc-jp";
			  new Promise<string>((resolve, reject) => {
				  this.pubgclient.getPlayers(region, { names: [args[1]] })
				  .then((players) => {
					  resolve(
						  JSON.stringify(players[0])
					  );
				  }).catch(err => {
					  reject(err);
				  })
			  }).then((mes) => {
				  try {
					  message.channel.createMessage(mes);
				  } catch (e) {
					  console.log(e);
				  }
			  }).catch(e => console.log(e));
		  }
      }
  }
}
