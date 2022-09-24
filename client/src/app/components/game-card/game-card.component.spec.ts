import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameCardComponent } from './game-card.component';
import { GameCardService } from '@app/services/game-card.service';
import { GameCategory } from '@app/enums/game-category';
import { GameCard } from '@app/interfaces/game-card';

const GAME_CARD: GameCard = {
    gameInformation: {
        gameName: 'test',
        imgName: 'imageName',
        scoresSolo: [
            { playerName: 'solo1', time: 60, category: GameCategory.Solo },
            { playerName: 'solo2', time: 90, category: GameCategory.Solo },
        ],
        scoresMultiplayer: [
            { playerName: 'multi1', time: 125, category: GameCategory.Multiplayer },
            { playerName: 'multi2', time: 12, category: GameCategory.Multiplayer },
        ],
    },
    isShown: true,
    isAdminCard: true,
};

describe('GameCardComponent', () => {
    let component: GameCardComponent;
    let fixture: ComponentFixture<GameCardComponent>;
    let spyGameCardService: jasmine.SpyObj<GameCardService>;

    beforeEach(async () => {
        spyGameCardService = jasmine.createSpyObj('GameCardService', ['openNameDialog', 'deleteGame', 'resetHighScores']);
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [GameCardComponent],
            providers: [
                {
                    provide: GameCardService,
                    useValue: spyGameCardService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameCardComponent);
        component = fixture.componentInstance;
        component.gameCard = GAME_CARD;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('formatScoreTime should format the given seconds to correct format', () => {
        expect(component.formatScoreTime(component.gameCard.gameInformation.scoresSolo[0].time)).toEqual('1:00');
        expect(component.formatScoreTime(component.gameCard.gameInformation.scoresSolo[1].time)).toEqual('1:30');
        expect(component.formatScoreTime(component.gameCard.gameInformation.scoresMultiplayer[0].time)).toEqual('2:05');
        expect(component.formatScoreTime(component.gameCard.gameInformation.scoresMultiplayer[1].time)).toEqual('0:12');
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

    it('onClickPlayGame should call the open name dialog method', () => {
        component.onClickPlayGame();
        expect(spyGameCardService.openNameDialog).toHaveBeenCalled();
    });

    it('onClickDeleteGame should call the deleteGame method from gameCardService', () => {
        component.onClickDeleteGame(component.gameCard);
        expect(spyGameCardService.deleteGame).toHaveBeenCalled();
    });

    it('onClickResetHighScores should call the resetHighScores method from gameCardService', () => {
        component.onClickResetHighScores(component.gameCard);
        expect(spyGameCardService.resetHighScores).toHaveBeenCalled();
    });
});
