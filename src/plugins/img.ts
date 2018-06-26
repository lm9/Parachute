import { Message, Attachment } from "eris";
import { Permission, Plugin } from "../parachute";
import * as Jimp from "jimp";

export = class Img extends Plugin {
	readonly label: string = "img";
	readonly permission: Permission = Permission.USER;
	readonly name: string = "Img";

	public run(message: Message, args: string[] = []) {
		const imgFile = Img.searchImgFile(message.attachments);
		if (!imgFile) return;

		switch (args[0]) {
			case "sym":
			case "symmetry":
			case "シンメトリー":
				this.replySymmetry(message, imgFile, args);
				break;
			default:
				break;
		}
	}

	private static searchImgFile(attachments: Attachment[]) {
		for (const attachment of attachments) {
			if (attachment.filename.match(/\.(jpeg|jpg|png|gif|)$/i)) {
				return attachment;
			}
		}
	}

	private replySymmetry(message: Message, imgFile: Attachment, args: string[]) {
		const cursor = args[2] ? parseFloat(args[2]) : 0.5;
		const isLeft = args[1] == "true";
		message.channel.createMessage("OK．まっててね...").then(() => {
			Img.makeSymmetry(imgFile.url, cursor, isLeft)
				.then(img => {
					img.getBuffer("image/png", (err, buf) => {
						if (err) console.log(err);
						message.channel.createMessage(`${message.author.mention} できたよ`, {
							file: buf,
							name: imgFile.filename
						});
					});
				})
				.catch(err =>
					message.channel.createMessage(
						`${message.author.mention} なんかだめみたいですね ${err.toString().substr(0, 100)}`
					)
				);
		});
	}

	public static makeSymmetry(filePath: string, cursor: number = 0.5, isLeft: boolean = false) {
		return new Promise<Jimp.Jimp>((resolve, reject) => {
			if (0.0 < cursor && cursor < 1.0) {
				try {
					Jimp.read(filePath, (err, img) => {
						if (err) reject(err);
						const baseWidth = img.bitmap.width;
						const baseHeight = img.bitmap.height;
						const baseImg = img
							.clone()
							.crop(
								isLeft ? 0 : baseWidth * cursor,
								0,
								isLeft ? baseWidth * cursor : baseWidth * (1 - cursor),
								baseHeight
							);
						const mirroredImg = baseImg.clone().mirror(true, false);
						const resultImg = baseImg
							.contain(
								baseImg.bitmap.width * 2,
								baseHeight,
								isLeft ? Jimp.HORIZONTAL_ALIGN_LEFT : Jimp.HORIZONTAL_ALIGN_RIGHT
							)
							.composite(mirroredImg, isLeft ? baseImg.bitmap.width / 2 : 0, 0);
						resolve(resultImg);
					}).catch(e => reject(e));
				} catch (e) {
					reject(e);
				}
			} else {
				reject("Cursor must be larger than 0 and lower than 1.0");
			}
		});
	}
};
