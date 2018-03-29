// bot.js
// most of type annotations are not needed in an actual project, this is just an example
import { Client, Message, Member, AnyChannel, VoiceChannel, Collection, VoiceState} from 'eris';

class Parachute{
	private client: Client;
	private owner: string;
	private prefix: string;

	constructor(token: string, owner: string, prefix: string = "!")
	{
		this.client = new Client(token);
		this.owner = owner;
		this.prefix = prefix;
		this.setup();
	}
	run()
	{
		this.client.connect();
	}
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
	private command_match(content: string, command: string): boolean
	{
		if(content.match(new RegExp(String.raw`${this.prefix}${command}`)))
		{
			return true;
		}
		{
			return false;
		}
	}
	private get_voice_channel_members(message: Message): Collection<Member> | null{
		if(message.member && message.member.voiceState.channelID)
		{
			try{
				const channel: VoiceChannel = this.client.getChannel(message.member.voiceState.channelID);
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
	private stop(message: Message)
	{
		if(message.author.id !== this.owner) return;
		if(this.command_match(message.content, "stop"))
		{
			this.client.disconnect({reconnect: false});
		}
	}
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
	// for squad x2
	private auto_grouping(message: Message)
	{
		if(this.command_match(message.content, "team"))
		{
			const members = this.get_voice_channel_members(message);
			if(members/* && members.size >= 5*/)
			{
				const members_count: number = members.size;

				let teams: Member[][] = [[], []];
				let cnt:number = 0;

				// おるメンツを適当に並び替える
				while(members.size > 0)
				{
					cnt++;
					const member = members.random();
					teams[cnt > parseInt(members_count / 2) ? 0 : 1].push(member);
					members.delete(member.id); // キーとidが同じなので
				}

				let mes: string = "";
				for(let i = 0; i < 2; ++i)
				{
					mes += `Team ${i + 1}`;
					for(let j = 0; j < teams[i].length; ++j)
					{
						mes += ` ${teams[i][j].username}${j < teams[i].length -1 ? "," : "\n"}`;
					}
				}
				try{
					message.channel.createMessage(mes);
				} catch(e) {
					console.log(e);
				}
			}
			else
			{
				try{
					message.channel.createMessage("なんらかのエラーがあり，メンバーが足りていない，実行者がボイスチャンネルに参加していないなどが考えられます．");
				} catch(e){
					console.error(e);
				}
			}
		}
	}
}

export = Parachute;