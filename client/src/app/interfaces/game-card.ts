import { PublicGameInformation } from '@common/game-information';

export interface GameCard {
    gameInformation: PublicGameInformation;
    isShown: boolean;
    isAdminCard: boolean;
    isMulti: boolean;
}
