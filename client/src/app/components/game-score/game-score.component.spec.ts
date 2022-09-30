import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameScoreComponent } from './game-score.component';

const SCORES = [
    {
        playerName: 'player1',
        time: 100,
    },
    {
        playerName: 'player2',
        time: 200,
    },
];

describe('GameScoreComponent', () => {
    let component: GameScoreComponent;
    let fixture: ComponentFixture<GameScoreComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameScoreComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GameScoreComponent);
        component = fixture.componentInstance;
        component.scores = SCORES;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should verify if it has scores', () => {
        expect(component.hasScores()).toBeTruthy();
        component.scores = [];
        expect(component.hasScores()).toBeFalsy();
    });

    it('should format score time', () => {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(component.formatScoreTime(70)).toEqual('1:10');
    });
});
