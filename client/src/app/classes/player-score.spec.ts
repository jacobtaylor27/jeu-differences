import { TestBed } from '@angular/core/testing';
import { PlayerScore } from '@app/classes/player-score';
import { GameCategory } from '@app/enums/game-category';

describe('Score', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PlayerScore],
        }).compileComponents();
    });

    it('A new players score should be created', () => {
        const time = 3;
        const playersName = 'Arthur';
        const playerScore = new PlayerScore(playersName, time, GameCategory.Solo);
        expect(playerScore).toBeTruthy();
    });

    it('The methodes should make the attributes accessible', () => {
        const time = 3;
        const name = 'Arthur';
        const playerScore = new PlayerScore(name, time, GameCategory.Solo);
        expect(playerScore.playerName).toEqual(name);
        expect(playerScore.category).toBe(GameCategory.Solo);
        expect(playerScore.time).toEqual(time);
    });
});
