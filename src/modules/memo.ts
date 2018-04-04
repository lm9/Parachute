import { Client, Message, Collection, Member } from "eris";
import { Permission, ParachuteModule } from "../parachute";
import DiscordMemo from "./lib/discord_memo"

export default class Memo extends ParachuteModule {
  readonly label: string = "memo";
  readonly permission: Permission = Permission.USER;
  readonly name: string = "Memo";
  private called_count: { [key: string]: number } = {};
  private memo: DiscordMemo;

  constructor(client: Client) {
    super(client);
    this.memo = new DiscordMemo("./db/demo.db");
  }

  public run(message: Message, args: string[] = []) {
    if (args) {
        new Promise<string[]>((resolve, reject) => {
          const new_memos: string[] = [];
          args.forEach((arg) => {
            switch (arg) {
              case "-h":
                try {
                  message.channel.createMessage("<HELP MESSAGE>");
                  resolve();
                } catch (e) {
                  reject(e);
                }
                break;
              case "-l":
                this.memo.list(message.author.id, message.channel.id)
                .then((memos) => {
                  let response = "";
                  memos.forEach((memo) => {
                    response += `${memo.sentence} [${memo.id}]\n`;
                  });
                  try {
                    message.channel.createMessage(response);
                    resolve();
                  } catch (e) {
                    reject(e);
                  }
                });
                break;
              default:
                if (!arg.startsWith("-")) new_memos.push(arg);
                break;
            }
            resolve(new_memos);
          });
        }).then((new_memos) => {
          if (new_memos) this.memo.add(message.author.id, message.channel.id, new_memos); 
        });
    } else {
      try {
        message.channel.createMessage("引数を指定してね！");
      } catch (e) {
        console.log(e);
      }
    }
  }
}