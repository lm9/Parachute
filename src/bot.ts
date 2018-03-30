import Parachute = require("./parachute");
import * as fs from "fs";
import {Client, Message, Collection, Member} from "eris";

const keys = JSON.parse(fs.readFileSync('./confs/keys.json', 'utf8'))
const settings = JSON.parse(fs.readFileSync('./confs/settings.json', 'utf8'))

const token = keys["token"];
const owner = settings["owner"];
const prefix = settings["command_prefix"];

const parachute = new Parachute(token, owner, prefix);

parachute.register_command("hoge", (client: Client, message: Message) => {
    console.log(message);
});

parachute.register_command("ping", (client: Client, message: Message) => {
    try{
        message.channel.createMessage("pong!");
    } catch (e) {
        console.error(e);
    }
});

parachute.register_command("team", (client: Client, message: Message) => {
    let _members: Collection<Member> = (() => {
        // 空ならどうしようもない
        if(!message.member || !message.member.voiceState.channelID) return;
        try{
            const channel:any = client.getChannel(message.member.voiceState.channelID);
            if(channel.voiceMembers)
            {
                return channel.voiceMembers;
            }						
        } catch (e) {
            console.error(e);
        }
    })();
    
    if(!_members) return; // null check

    let members: Member[] = [];

    // 配列に移し替える
    _members.forEach((member: Member) => {	
        members.push(member);
    });

    // シャッフルを行う
    shuffle_members(members);
        
    // メッセージの組み立て
    let mes: string = "TEAM1:";
    for(let i = 0; i < members.length; ++i)
    {
        if(i == Math.floor(members.length / 2))
        {
            mes += "\nTEAM2:";
        }
        mes += ` ${members[i].username}`;
    }

    // メッセージの送信
    try{
        message.channel.createMessage(mes);
    } catch(e) {
        console.log(e);
    }
});

function shuffle_members(members: Member[])
{
	// Fisher-Yates shuffle
	for(let i = members.length - 1; i > 0; i--)
	{
		let n = Math.floor(Math.random() * (i + 1));
		let tmp = members[i];
		members[i] = members[n];
		members[n] = tmp;
	}
}

export = parachute;