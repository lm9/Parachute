import sqlite3 from "sqlite3";

namespace sqlite3ex {
	export class Database {
		private db: sqlite3.Database;

		constructor(db: sqlite3.Database);
		constructor(dbfile: string);
		constructor(arg: any) {
			this.db = arg instanceof sqlite3.Database ? arg : new sqlite3.Database(arg);
		}

		run(query: string) {
			return new Promise((resolve, reject) => {
				this.db.serialize(() => {
					this.db.run(query, err => {
						if (err) reject(err);
						else resolve();
					});
				});
			});
		}

		all(query: string) {
			return new Promise<any[]>((resolve, reject) => {
				this.db.serialize(() => {
					this.db.all(query, (err, rows) => {
						if (err) reject(err);
						else resolve(rows);
					});
				});
			});
		}

		each(query: string) {
			return new Promise<any[]>((resolve, reject) => {
				this.db.serialize(() => {
					const rows: any[] = [];
					this.db.each(
						query,
						(err, row) => {
							if (!err) rows.push(row);
						},
						(err, n) => {
							if (err) reject(err);
							else resolve(rows);
						}
					);
				});
			});
		}

		begin() {
			return this.run("BEGIN");
		}

		commit() {
			return this.run("COMMIT");
		}

		rollback() {
			return this.run("ROLLBACK");
		}

		prepare(query: string) {
			return new Statement(this.db.prepare(query));
		}
	}

	export class Statement {
		private stmt: sqlite3.Statement;

		constructor(stmt: sqlite3.Statement) {
			this.stmt = stmt;
		}

		run(...params: any[]) {
			return new Promise((resolve, reject) => {
				this.stmt.run(params, err => {
					if (err) reject(err);
					else resolve();
				});
			});
		}

		all(...params: any[]) {
			return new Promise<any[]>((resolve, reject) => {
				this.stmt.all(params, (err, rows) => {
					if (err) reject(err);
					else resolve(rows);
				});
			});
		}

		finalize() {
			return new Promise((resolve, reject) => {
				this.stmt.finalize(err => {
					if (err) reject();
					else resolve();
				});
			});
		}
	}
}

export = sqlite3ex;
