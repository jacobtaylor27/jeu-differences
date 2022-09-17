import { Score } from "@app/classes/score";

export class GameCard {
    public isShown: boolean = false;
    public gameName: string;
    public imgSource: string;
    public scoresSolo: Score[];
    public scoresMultiplayer: Score[];
}
