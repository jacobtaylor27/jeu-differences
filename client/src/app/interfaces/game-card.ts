import { PlayerScore } from '@app/classes/player-score';

export interface GameCard {
    isShown: boolean;
    isCreated: boolean;
    isAdminCard: boolean;
    gameName: string;
    imgSource: string;
    scoresSolo: PlayerScore[];
    scoresMultiplayer: PlayerScore[];
}
