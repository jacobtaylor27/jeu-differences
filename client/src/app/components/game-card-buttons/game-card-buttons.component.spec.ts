import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GameCard } from '@app/interfaces/game-card';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameCardService } from '@app/services/game-card/game-card.service';
import { RouterService } from '@app/services/router-service/router.service';
import { GameCardButtonsComponent } from './game-card-buttons.component';

const GAME_CARD: GameCard = {
    gameInformation: {
        id: '1',
        name: 'test',
        thumbnail: 'image',
        idOriginalBmp: '1',
        idEditedBmp: '1',
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
        nbDifferences: 1,
        isMulti: true,
    },
    isMulti: true,
    isShown: true,
    isAdminCard: true,
};

describe('GameCardButtonsComponent', () => {
    let component: GameCardButtonsComponent;
    let fixture: ComponentFixture<GameCardButtonsComponent>;
    let spyGameCardService: jasmine.SpyObj<GameCardService>;
    let spyRouterService: jasmine.SpyObj<RouterService>;

    beforeEach(async () => {
        spyGameCardService = jasmine.createSpyObj('GameCardService', ['openNameDialog', 'deleteGame', 'resetHighScores']);
        spyRouterService = jasmine.createSpyObj('RouterService', ['reloadPage']);
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
                {
                    provide: RouterService,
                    useValue: spyRouterService,
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

    it('should call the reload page method', () => {
        component.onClickDeleteGame(GAME_CARD);
        expect(spyRouterService.reloadPage).toHaveBeenCalledWith('admin');
    });

    it('should return is multi attribute', () => {
        expect(component.isMultiplayer()).toBeTrue();
    });

    it('should call open name dialog when clicking create or join', () => {
        component.onClickCreateJoinGame();
        expect(spyGameCardService.openNameDialog).toHaveBeenCalled();
    });

    // it('onClickResetHighScores should call the resetHighScores method from gameCardService', () => {});
});
