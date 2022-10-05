import { GameInfo } from '@common/game-info';

export interface GameCard {
    gameInformation: GameInfo;
    isShown: boolean;
    isAdminCard: boolean;
}
