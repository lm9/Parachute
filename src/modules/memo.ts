import { Client, Message, Collection, Member } from "eris";
import { Permission, ParachuteModule } from "../parachute";

class Memo implements ParachuteModule {
  readonly label: string = "memo";
  readonly permission: Permission = Permission.USER;
  readonly name: string = "Memo";
  private called_count: { [key: string]: number } = {};
  private client?: Client;

  private memo_data: { [key: string]: { [key: string]: string[] } } = {};

  public setup(client: Client) {
    this.client = client;
  }

  public run(message: Message, args: string[] = []) {
    // 初ちゃんねる
    if (!this.memo_data[message.channel.id]) {
      this.memo_data[message.channel.id] = {};
    }

    // 初チャンネル 初ユーザ
    if (!this.memo_data[message.channel.id][message.author.id]) {
      this.memo_data[message.channel.id][message.author.id] = [];
    }

    let memos = this.memo_data[message.channel.id][message.author.id];

    let mes = "";

    if (args.length < 1) {
      mes = "メモを保存するには少なくとも引数を1つ指定してください．";
    } else {
      let memo_count = 0;
      args.forEach((arg: string) => {
        switch (arg) {
          case "-help":
            mes = `
memo <MEMO SENTENCE>
memo -help: This help
memo -l: Your memos
            `;
            break;
          case "-l":
            if (memos.length < 1) {
              mes = "1件も保存されていません．\n";
            } else {
              for (let i = 0; i < memos.length; ++i) {
                mes += `[${i}]: ${memos[i]}\n`;
              }
            }
            break;
          default:
            // ソレ以外をメモする
            memos.push(arg);
            ++memo_count;
            break;
        }
      });

      if (0 < memo_count) {
        mes += `${memo_count}件メモしました．`;
      }
    }

    // メッセージを返信
    try {
      message.channel.createMessage(mes);
    } catch (e) {
      console.error(e);
    }
  }
}

export = { label: "memo", command: new Memo(), permission: Permission.USER };
