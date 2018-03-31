import { Client, Message, Member, AnyChannel, VoiceChannel, Collection, VoiceState } from 'eris';

class Parachute{
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
  public register_command(label: string, command: Function, permission: Parachute.Permission = Parachute.Permission.USER) {
    this.client.on('messageCreate', async (message: Message) => {
      // Guildによって切り分けたりもしたいが
      switch (permission) {
        case Parachute.Permission.USER:
          break;
        case Parachute.Permission.OWNER:
          if (message.author.id !== this.owner) return;
          break;
        case Parachute.Permission.ADMIN:
          // 特に今はないので
          break;
      }

      if (this.command_match(message.content, label)) {
        command(this.client,message);
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
  private command_match(content: string, command: string): boolean {
    if (content.match(new RegExp(String.raw`${this.prefix}${command}`))) {
      return true;
    }
    return false;
  }
}

module Parachute {
  export enum Permission
  {
    OWNER,
    ADMIN,
    USER,
  }
}

export = Parachute;
