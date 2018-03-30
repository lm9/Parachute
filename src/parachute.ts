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

	// コマンドの登録
	public register_command(label: string, command: Function)
	{
		this.client.on('messageCreate', async (message: Message) => {
			if(this.command_match(message.content, label))
			{
				command(this.client,message);
			}
		});
		
	}

	// セットアップ
	private setup()
	{
		this.client.on('messageCreate', async (message: Message) => {
			if (message.author.bot) return;
			// prefixを通すもの
			if (!message.content.startsWith(this.prefix)) return;
			this.stop(message);
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

	// botの停止コマンド
	private stop(message: Message)
	{
		if(message.author.id !== this.owner) return;
		if(this.command_match(message.content, "stop"))
		{
			this.client.disconnect({reconnect: false});
		}
	}
}

export = Parachute;