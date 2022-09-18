import { TestBed } from '@angular/core/testing';
import { GameCard } from '@app/classes/game-card';

describe('GameCard', () => {
    let gameCard: GameCard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GameCard],
        });
        gameCard = TestBed.inject(GameCard);
    });

    it('should be created', () => {
        expect(gameCard).toBeTruthy();
    });
});