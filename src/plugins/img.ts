import { Message, Attachment } from "eris";
import { Permission, Plugin } from "../parachute";
import * as Jimp from "jimp";

export default class Img extends Plugin {
	readonly label: string = "img";
	readonly permission: Permission = Permission.USER;
	readonly name: string = "Img";

	public run(message: Message, args: string[] = []) {
		const imgFile = Img.searchImgFile(message.attachments);
		if (!imgFile) return;

		switch (args[0]) {
			case "symmetry":
			case "シンメトリー":
				message.channel.createMessage("OK．まっててね...").then(() => {
					this.makeSymmetry(imgFile.url)
						.then(img => {
							img.getBuffer("image/png", (err, buf) => {
								if (err) console.log(err);
								message.channel.createMessage("できたよ", { file: buf, name: imgFile.filename });
							});
						})
						.catch(err => console.log(err));
				});
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

	private makeSymmetry(filePath: string) {
		return new Promise<Jimp.Jimp>((resolve, reject) => {
			Jimp.read(filePath, (err, img) => {
				if (err) reject(err);
				img.composite(
					img
						.clone()
						.mirror(true, false)
						.crop(img.bitmap.width / 2, 0, img.bitmap.width / 2, img.bitmap.height),
					img.bitmap.width / 2,
					0
				);
				resolve(img);
			});
		});
	}
}
