import { TestBed } from '@angular/core/testing';
import { GameCard } from '@app/classes/game-card';

describe('CanvasTestHelper', () => {
    let gameCard: GameCard;

    beforeEach(() => {
        gameCard = TestBed.inject(GameCard);
    });

    it('should be created', () => {
        expect(gameCard).toBeTruthy();
    });
});