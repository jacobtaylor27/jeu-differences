import { PlayerScore } from '@app/classes/player-score';

export interface GameCard {
    isShown: boolean;
    gameName: string;
    imgSource: string;
    scoresSolo: PlayerScore[];
    scoresMultiplayer: PlayerScore[];
}
