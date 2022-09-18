import { TestBed } from '@angular/core/testing';
import { Score } from '@app/classes/score';
import { GameCategory } from '@app/enums/game-category';

describe('Score', () => {
    let score: Score;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Score],
        }).compileComponents();

        score = new Score('test', 10, GameCategory.Solo);
    });

    it('should be created', () => {
        expect(score).toBeTruthy();
    });

    it('should convert time', () => {
        score.time = 60;
        expect(score.convertTime()).toEqual('1:00');

        score.time = 9;
        expect(score.convertTime()).toEqual('0:09');
    });
});
