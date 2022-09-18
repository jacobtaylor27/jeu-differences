import { GameCard } from '@app/classes/game-card';

describe('GameCard', () => {
    let gameCard: GameCard;

    beforeEach(() => {
        gameCard = new GameCard();
    });

    it('should be created', () => {
        expect(gameCard).toBeTruthy();
    });
});