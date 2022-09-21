import { PlayerScore } from '@app/classes/player-score';
import { GameInformation } from './game-information';

export interface GameCard {
    gameInformation: GameInformation;
    isShown: boolean;
    isCreated: boolean;
    isAdminCard: boolean;
    gameName: string;
    imgSource: string;
    scoresSolo: PlayerScore[];
    scoresMultiplayer: PlayerScore[];
}
