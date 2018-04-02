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
    public register_command(label: string, command: Function | ParachuteModule, permission: Permission): void;
    public register_command(module: { label: string, command: Function | ParachuteModule, permission: Permission }): void;
    public register_command(...args: any[]) {
      let label: string;
      let command: Function | ParachuteModule;
      let permission: Permission;

      switch (args.length) {
        case 1:
          label = args[0].label;
          command = args[0].command;
          permission = args[0].permission;
          break;
        case 3:
          label = args[0];
          command = args[1];
          permission = args[2];
          break;
        default:
          return;
      }

      // clientを入れてやる
      if (!(command instanceof Function)) {
        command.setup(this.client);
      }

      this.client.on("messageCreate", async (message: Message) => {
        // Guildによって切り分けたりもしたいが
        switch (permission) {
          case Permission.USER:
            break;
          case Permission.OWNER:
            if (message.author.id !== this.owner) return;
            break;
          case Permission.ADMIN:
            // 特に今はないので
            break;
        }

        const args = this.command_match(message.content, label);
        if (args) {
          if (command instanceof Function) {
            command(this.client, message, args);
          } else {
            command.run(message, args);
          }
        }
      });
      console.log(`Loaded module: ${command.name}`);
    }

    // セットアップ
    private setup() {
      this.client.on("ready", () => {
        console.log(`Ready as ${this.client.user.username}#${this.client.user.discriminator}`);
      });
    }

    // コマンドのチェック
    private command_match(content: string, command: string): string[] | null {
      const args = content.split(/[ 　]+/);
      if (args[0] === `${this.prefix}${command}`) {
        args.shift();
        return args;
      }
      return null;
    }
  }
  export interface ParachuteModule {
    readonly label: string;
    readonly permission: Permission;
    readonly name: string;
    setup(client: Client): void;
    run(message: Message, args: string[]): void;
  }
}

export = Parachute;
