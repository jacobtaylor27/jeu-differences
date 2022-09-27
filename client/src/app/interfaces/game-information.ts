import { PlayerScore } from '@app/classes/player-score';

export interface GameInformation {
    imgName: string;
    name: string;
    scoresSolo: PlayerScore[];
    scoresMultiplayer: PlayerScore[];
}
