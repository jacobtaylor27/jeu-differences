import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameCard } from '@app/interfaces/game-card';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameCardService } from '@app/services/game-card/game-card.service';
import { GameCardButtonsComponent } from './game-card-buttons.component';

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

describe('GameCardButtonsComponent', () => {
    let component: GameCardButtonsComponent;
    let fixture: ComponentFixture<GameCardButtonsComponent>;
    let spyGameCardService: jasmine.SpyObj<GameCardService>;

    beforeEach(async () => {
        spyGameCardService = jasmine.createSpyObj('GameCardService', ['openNameDialog', 'deleteGame', 'resetHighScores']);

        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [GameCardButtonsComponent],
            providers: [
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
