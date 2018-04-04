import { Client, Message, Member, Collection, VoiceState } from "eris";

namespace Parachute {
  export enum Permission {
    OWNER,
    ADMIN,
    USER
  }

  export class Parachute {
    private client: Client;
    private owner: string; // オーナのid
    private prefix: string;

    constructor(token: string, owner: string, prefix: string = "!") {
      this.client = new Client(token);
      this.owner = owner;
      this.prefix = prefix;
      this.setup();
    }

    // 実行
    run() {
      this.client.connect();
    }

    // コマンドの登録
    public register_command(module: any) {
      
      const pm: Plugin = new module(this.client);

      // 必要なのものがとりあえず揃っている
      if (!(pm.label && pm.name && pm.run)) return;

      this.client.on("messageCreate", async (message: Message) => {
        // Guildによって切り分けたりもしたいが
        switch (pm.permission) {
          case Permission.USER:
            break;
          case Permission.OWNER:
            if (message.author.id !== this.owner) return;
            break;
          case Permission.ADMIN:
            // 特に今はないので
            break;
        }

        const args = this.command_match(message.content, pm.label);
        if (args) {
          pm.run(message, args);
        }
      });
      
      console.log(`Loaded module: ${pm.name}`);
    }

    // セットアップ
    private setup() {
      this.client.on("ready", () => {
        console.log(`Ready as ${this.client.user.username}#${this.client.user.discriminator}`);
      });
    }

    // コマンドのチェック
    private command_match(content: string, command: string): string[] | null {
      const args = content.split(/ +/);
      if (args[0] === `${this.prefix}${command}`) {
        args.shift();
        return args;
      }
      return null;
    }
  }

  export abstract class Plugin {
    abstract readonly label: string;
    abstract readonly permission: Permission;
    abstract readonly name: string;
    protected client: Client;
    constructor(client: Client) {
      this.client = client;
    }
    abstract run(message: Message, args: string[]): void;
  }

}

export = Parachute;
