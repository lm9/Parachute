import * as sqlite3ex from "./sqlite3ex";
import uuid from "uuid";

class DiscordMemo {
	private db: sqlite3ex.Database;

	constructor(file: string) {
		this.db = new sqlite3ex.Database(file);
		this.db.run(`
		CREATE TABLE IF NOT EXISTS memo(
			id TEXT PRIMARY KEY NOT NULL,
			user_id TEXT NOT NULL,
			channel_id TEXT NOT NULL,
			sentence TEXT NOT NULL,
			created_at DEFAULT CURRENT_TIMESTAMP
		);
		`);
	}

	async add(user_id: string, channel_id: string, sentences: string[]) {
		if (sentences.length < 1) return;
		const stmt = await this.db.prepare(`
		INSERT INTO memo(id, user_id, channel_id, sentence)
		VALUES(?, ?, ?, ?)
		`);
		this.db.begin().then(() => {
			new Promise((resolve, reject) => {
				let err = false;
				sentences.forEach(async sentence => {
					stmt
						.run(uuid(), user_id, channel_id, sentence)
						.catch(() => {
							err = true;
						})
						.then(() => {
							if (err) reject();
							else resolve();
						});
				});
			})
				.then(() => {
					this.db.commit();
				})
				.catch(() => {
					this.db.rollback();
				})
				.then(() => {
					stmt.finalize();
				});
		});
	}

	async list(user_id: string, channel_id: string) {
		const stmt = await this.db.prepare(`
		SELECT * FROM memo
		WHERE user_id = ? AND channel_id = ?
		`);
		const result = await stmt.all(user_id, channel_id);
		await stmt.finalize();
		return result;
	}

	async remove(user_id: string, memo_id: string) {
		const stmt = await this.db.prepare(`
		DELETE FROM memo
		WHERE user_id = ? AND id = ?
		`);
		const result = await stmt.run(user_id, memo_id);
		await stmt.finalize();
		return result;
	}
}

export = DiscordMemo;
