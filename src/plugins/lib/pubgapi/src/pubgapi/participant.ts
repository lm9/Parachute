namespace PUBGAPI {
    export class Participant {
        readonly type: string = "participant";
        readonly id: string;
        readonly attributes: {
            actor: string;
            shardId: string;
            stats: any; 
        };
        constructor(data: any) {
            if (data.type !== this.type) throw new Error("Data isn't Participant's");
            this.id = data.id;
            this.attributes = data.attributes;
        }
    }
}

export = PUBGAPI;