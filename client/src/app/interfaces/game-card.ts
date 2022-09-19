import { PlayerScore } from '@app/classes/player-score';

export interface GameCard {
    isShown: boolean;
    isCreated: boolean;
    gameName: string;
    imgSource: string;
    scoresSolo: PlayerScore[];
    scoresMultiplayer: PlayerScore[];
}
