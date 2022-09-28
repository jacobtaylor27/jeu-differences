import { GameInformation } from './game-information';

export interface GameCard {
    gameInformation: GameInformation;
    isShown: boolean;
    isAdminCard: boolean;
}
