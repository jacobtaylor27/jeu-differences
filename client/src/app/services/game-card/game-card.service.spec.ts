import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GameCard } from '@app/interfaces/game-card';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameCardHandlerService } from '@app/services/game-card-handler/game-card-handler.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameCardService } from './game-card.service';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

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
    },
    isShown: true,
    isAdminCard: true,
    isMulti: true,
};

describe('GameCardService', () => {
    let service: GameCardService;
    let spyGameCardHandlerService: jasmine.SpyObj<GameCardHandlerService>;
    let spyMatDialog: jasmine.SpyObj<MatDialog>;
    let spyCommunicationService: jasmine.SpyObj<CommunicationService>;

    beforeEach(() => {
        spyGameCardHandlerService = jasmine.createSpyObj<GameCardHandlerService>('GameCardHandlerService', ['resetHighScores']);
        spyCommunicationService = jasmine.createSpyObj<CommunicationService>('CommunicationService', ['deleteGame']);
        spyMatDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
        TestBed.configureTestingModule({
            imports: [AppMaterialModule, NoopAnimationsModule, HttpClientModule],
            providers: [
                { provide: GameCardHandlerService, useValue: spyGameCardHandlerService },
                { provide: MatDialog, useValue: spyMatDialog },
                { provide: CommunicationService, useValue: spyCommunicationService },
            ],
        });
        service = TestBed.inject(GameCardService);
        spyCommunicationService.deleteGame.and.returnValue(of());
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('openNameDialog should call open from matDialog', () => {
        service.openNameDialog();
        expect(spyMatDialog.open).toHaveBeenCalled();
    });

    it('deleteGame should call deleteGame from gameCardHandlerService', () => {
        service.deleteGame(GAME_CARD.gameInformation.id);
        expect(spyCommunicationService.deleteGame).toHaveBeenCalled();
    });

    // it('resetHighScores should call restHighScores from gameCardHandlerService', () => {});
});
