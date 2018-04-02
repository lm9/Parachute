import { Client, Message, Collection, Member } from "eris";
import { Permission, ParachuteModule } from "../parachute";

class AutoGrouping implements ParachuteModule {
  readonly label: string = "team";
  readonly permission: Permission = Permission.USER;
  readonly name: string = "AutoGrouping";
  private client?: Client;

  public setup(client: Client) {
    this.client = client;
  }

  run(message: Message, args: string[] = []) {
    if (!this.client) return;
    const members: Member[] = (() => {
      const members: Member[] = [];
      // 空ならどうしようもない
      if (message.member && message.member.voiceState.channelID) {
        try {
          const channel:any = this.client.getChannel(message.member.voiceState.channelID);
          if (channel.voiceMembers) {
            channel.voiceMembers.forEach((member: Member) => {
              members.push(member);
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
      return members;
    })();

    let mes: string = "";

    // 人数が足りない場合
    if (members.length < 4) {
      mes = "人数が足りてないんじゃない？";
    } else {
      // シャッフルを行う
      this.shuffle_members(members);

      // メッセージの組み立て
      mes += "TEAM1:";
      for (let i = 0; i < members.length; ++i) {
        if (i === Math.floor(members.length / 2)) {
          mes += "\nTEAM2:";
        }
        mes += ` ${members[i].username}`;
      }
    }

    // メッセージの送信
    try {
      message.channel.createMessage(mes);
    } catch (e) {
      console.log(e);
    }
  }
  private shuffle_members(members: Member[]) {
    // Fisher-Yates shuffle
    for (let i = members.length - 1; i > 0; i--) {
      const n = Math.floor(Math.random() * (i + 1));
      const tmp = members[i];
      members[i] = members[n];
      members[n] = tmp;
    }
  }
}

export = { label: "team", command: new AutoGrouping(), permission: Permission.USER };
