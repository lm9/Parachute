import { Participant } from "./participant";
import { Roster } from "./roster";

namespace PUBGAPI {
    export class MatchData {
        readonly type: string = "match";
        readonly id: string;
        readonly attributes: {
            createdAt: string;
            duration: number;
            gameMode: string;
            patchVersion?: string;
            shardId: string;
            stats?: any;
            tags?: any;
            titleId: string;     
        };
        readonly relationships: {
            assets: any[];
            matches: any[];
        };
        readonly links: {
            shema?: string;
            self: string;
        }

        readonly participants: Participant[] = [];
        readonly rosters: Roster[] = [];

        constructor(data: any, included: any[]) {
            if (data.type !== this.type) throw new Error("Data isn't Match's");
            this.id = data.id;
            this.attributes = data.attributes;
            this.relationships = data.relationships;
            this.links = data.links;
            included.forEach((v: any) => {
                if (v.type === "roster") this.rosters.push(new Roster(v));
                if (v.type === "participant") this.participants.push(new Participant(v));
            })
        }
    }
}

export = PUBGAPI;