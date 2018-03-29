import jQuery from 'jquery'
import { Client, Message, Member, AnyChannel, VoiceChannel, Collection, VoiceState} from 'eris';

class Parachute{
	private client: Client;
	private owner: string; // オーナのid
	private prefix: string;

	constructor(token: string, owner: string, prefix: string = "!")
	{
		this.client = new Client(token);
		this.owner = owner;
		this.prefix = prefix;
		this.setup();
	}

	// 実行
	run()
	{
		this.client.connect();
	}

	// セットアップ
	private setup()
	{
		this.client.on('messageCreate', async (message: Message) => {
			if (message.author.bot) return;
			// prefixを通すもの
			if (!message.content.startsWith(this.prefix)) return;
			this.auto_grouping(message);
			this.stop(message);
			this.pingpong(message);
		});

		this.client.on('ready', () => {
			console.log(`Ready as ${this.client.user.username}#${this.client.user.discriminator}`);
		});
	}
	
	// コマンドのチェック
	private command_match(content: string, command: string): boolean
	{
		if(content.match(new RegExp(String.raw`${this.prefix}${command}`)))
		{
			return true;
		}
		else {
			return false;
		}
	}

	// ボイチャにおる人間を返すよう
	private get_voice_channel_members(message: Message): Collection<Member> | null
	{
		if(message.member && message.member.voiceState.channelID)
		{
			try{
				const channel:any = this.client.getChannel(message.member.voiceState.channelID);
				if(channel.voiceMembers)
				{
					return channel.voiceMembers;
				}						
			} catch (e) {
				console.error(e);
			}
			
		}
		return null;
	}

	// botの停止コマンド
	private stop(message: Message)
	{
		if(message.author.id !== this.owner) return;
		if(this.command_match(message.content, "stop"))
		{
			this.client.disconnect({reconnect: false});
		}
	}

	// 返信チェック用のping/pong
	private pingpong(message: Message)
	{
		if(this.command_match(message.content, "ping"))
		{
			try{
				message.channel.createMessage("pong!");
			} catch (e) {
				console.error(e);
			}
		}
	}

	// Member[]をシャッフルして返す	
	private shuffle_members(members: Member[])
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

	// 通話にいるメンバからチームわけをします
	private auto_grouping(message: Message)
	{
		if(this.command_match(message.content, "team"))
		{
			let _members = this.get_voice_channel_members(message);
			let members: Member[] = [];

			if(!_members) return; // null check

			// 配列に移し替える
			_members.forEach((member: Member) => {	
				members.push(member);
			});

			// シャッフルを行う
			this.shuffle_members(members);
				
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
		}
	}
}

export = Parachute;