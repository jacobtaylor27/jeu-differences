import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameCardButtonsComponent } from '@app/components/game-card-buttons/game-card-buttons.component';
import { GameScoreComponent } from '@app/components/game-score/game-score.component';
import { GameCard } from '@app/interfaces/game-card';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameCardComponent } from './game-card.component';

const GAME_CARD: GameCard = {
    gameInformation: {
        name: 'test',
        imgName: 'imageName',
        scoresSolo: [
            { playerName: 'solo1', time: 60 },
            { playerName: 'solo2', time: 90 },
        ],
        scoresMultiplayer: [
            { playerName: 'multi1', time: 125 },
            { playerName: 'multi2', time: 12 },
        ],
    },
    isShown: true,
    isAdminCard: true,
};

describe('GameCardComponent', () => {
    let component: GameCardComponent;
    let fixture: ComponentFixture<GameCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [GameCardComponent, GameScoreComponent, GameCardButtonsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GameCardComponent);
        component = fixture.componentInstance;
        component.gameCard = GAME_CARD;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('getGameName should return the name of the game', () => {
        expect(component.getGameName()).toEqual('test');
    });

    it('getImageName should return the name of the image', () => {
        expect(component.getImageName()).toEqual('imageName');
    });

    it('isAdminCard should return true if the card is in admin mode', () => {
        expect(component.isAdminCard()).toEqual(true);
    });

    it('getMultiplayerScores should return the multiplayer scores for a given game', () => {
        const scores = component.getMultiplayerScores();
        expect(scores).toBeDefined();
        expect(scores.length).toEqual(2);
    });

    it('getSinglePlayerScores should return the single player scores for a given game', () => {
        const scores = component.getSinglePlayerScores();
        expect(scores).toBeDefined();
        expect(scores.length).toEqual(2);
    });

    it('hasMultiplayerScores should return true if the game has a multiplayer score', () => {
        expect(component.hasMultiplayerScores()).toEqual(true);
    });

    it('hasSinglePlayerScores should return true if the game has a single player score', () => {
        expect(component.hasSinglePlayerScores()).toEqual(true);
    });
});
