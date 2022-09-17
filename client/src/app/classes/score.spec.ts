import { TestBed } from '@angular/core/testing';
import { Score } from '@app/classes/score';

describe('CanvasTestHelper', () => {
    let score: Score;

    beforeEach(() => {
        score = TestBed.inject(Score);
    });

    it('should be created', () => {
        expect(score).toBeTruthy();
    });
});