import { GameInformation } from '@app/interfaces/game-information';

export interface GameCard {
    gameInformation: GameInformation;
    isShown: boolean;
    isAdminCard: boolean;
}
