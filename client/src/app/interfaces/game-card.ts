import { GameInformation } from '@common/game-information';

export interface GameCard {
    gameInformation: GameInformation;
    isShown: boolean;
    isAdminCard: boolean;
}
