import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GameCard } from '@app/interfaces/game-card';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameCardService } from '@app/services/game-card/game-card.service';
import { GameCardButtonsComponent } from './game-card-buttons.component';

const GAME_CARD: GameCard = {
    gameInformation: {
        id: '1',
        name: 'test',
        thumbnail: 'image',
        idOriginalBmp: '1',
        idEditedBmp: '1',
        idDifferenceBmp: '1',
        soloScore: [
            {
                playerName: 'test2',
                time: 10,
            },
            {
                playerName: 'test',
                time: 10,
            },
        ],
        multiplayerScore: [
            {
                playerName: 'test2',
                time: 10,
            },
            {
                playerName: 'test',
                time: 10,
            },
        ],
        differenceRadius: 3,
        differences: [],
    },
    isShown: true,
    isAdminCard: true,
};

describe('GameCardButtonsComponent', () => {
    let component: GameCardButtonsComponent;
    let fixture: ComponentFixture<GameCardButtonsComponent>;
    let spyGameCardService: jasmine.SpyObj<GameCardService>;

    beforeEach(async () => {
        spyGameCardService = jasmine.createSpyObj('GameCardService', ['openNameDialog', 'deleteGame', 'resetHighScores']);

        await TestBed.configureTestingModule({
            imports: [AppMaterialModule, RouterTestingModule],
            declarations: [GameCardButtonsComponent],
            providers: [
                HttpHandler,
                HttpClient,
                {
                    provide: GameCardService,
                    useValue: spyGameCardService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameCardButtonsComponent);
        component = fixture.componentInstance;
        component.gameCard = GAME_CARD;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
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
