import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GameCard } from '@app/interfaces/game-card';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameCardHandlerService } from '@app/services/game-card-handler/game-card-handler.service';
import { GameCardService } from './game-card.service';

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
    },
    isShown: true,
    isAdminCard: true,
};

describe('GameCardService', () => {
    let service: GameCardService;
    let spyGameCardHandlerService: jasmine.SpyObj<GameCardHandlerService>;
    let spyMatDialog: jasmine.SpyObj<MatDialog>;

    beforeEach(() => {
        spyGameCardHandlerService = jasmine.createSpyObj<GameCardHandlerService>('GameCardHandlerService', ['deleteGame', 'resetHighScores']);
        spyMatDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
        TestBed.configureTestingModule({
            imports: [AppMaterialModule, NoopAnimationsModule],
            providers: [
                { provide: GameCardHandlerService, useValue: spyGameCardHandlerService },
                { provide: MatDialog, useValue: spyMatDialog },
            ],
        });
        service = TestBed.inject(GameCardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('openNameDialog should call open from matDialog', () => {
        service.openNameDialog();
        expect(spyMatDialog.open).toHaveBeenCalled();
    });

    it('deleteGame should call deleteGame from gameCardHandlerService', () => {
        service.deleteGame(GAME_CARD);
        expect(spyGameCardHandlerService.deleteGame).toHaveBeenCalledOnceWith(GAME_CARD);
    });

    it('resetHighScores should call restHighScores from gameCardHandlerService', () => {
        service.resetHighScores(GAME_CARD);
        expect(spyGameCardHandlerService.resetHighScores).toHaveBeenCalledOnceWith(GAME_CARD);
    });
});
