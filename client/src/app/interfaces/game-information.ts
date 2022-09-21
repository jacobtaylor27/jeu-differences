import { PlayerScore } from "@app/classes/player-score";

export interface GameInformation {
    imgName: string;
    gameName: string;
    scoresSolo: PlayerScore[];
    scoresMultiplayer: PlayerScore[];
}
