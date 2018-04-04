namespace PUBGAPI {
    export class Roster {
        readonly type: string = "roster";
        readonly id: string;
        readonly attributes: {
            shardId: string;
            stats: any;
            won: string; // TODO : TO boolean
        };
        readonly relationships: {
            participants: any; // めんどい
            team: any
        }
        constructor(data: any) {
            if (data.type !== this.type) throw new Error("Data isn't Roster's");
            this.id = data.id;
            this.attributes = data.attributes;
            this.relationships = data.relationships;
        }
    }
}

export = PUBGAPI;