import { Client, Message, Member, AnyChannel, VoiceChannel, Collection, VoiceState } from 'eris';

module Parachute {
  export enum Permission
  {
    OWNER,
    ADMIN,
    USER,
  }

  export class Parachute{
    private client: Client;
    private owner: string; // オーナのid
    private prefix: string;

    constructor(token: string, owner: string, prefix: string = '!') {
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
    public register_command(arg1?: any, arg2?: any, arg3?: any) {
      let label: string;
      let command: Function | ParachuteModule;
      let permission: Permission;

      if (typeof arg1 === 'string' && typeof arg3 === 'number') {
        label = arg1;
        command = arg2;
        permission = arg3;
      } else {
        label = arg1.label;
        command = arg1.command;
        permission = arg1.permission;
      }

      this.client.on('messageCreate', async (message: Message) => {
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
            command.run(this.client, message, args);            
          }
        }
      });
    }
      
    // セットアップ
    private setup() {
      this.client.on('ready', () => {
        console.log(`Ready as ${this.client.user.username}#${this.client.user.discriminator}`);
      });
    }
    
    // コマンドのチェック
    private command_match(content: string, command: string): string[] | null {
      const args = content.split(" ");
      if (args[0] === `${this.prefix}${command}`) {
        args.shift();
        return args;
      }
      return null;
    }
  }
  export interface ParachuteModule {
    readonly name: string;
    run(client: Client, message: Message, args: string[]): void;
  }
}

export = Parachute;
