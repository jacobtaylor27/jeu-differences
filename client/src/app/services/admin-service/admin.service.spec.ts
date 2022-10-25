import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { AppMaterialModule } from '@app/modules/material.module';
import { AdminService } from './admin.service';
import { GameCardHandlerService } from '@app/services/game-card-handler/game-card-handler.service';
import { CommunicationService } from '@app/services/communication/communication.service';

describe('AdminService', () => {
    let service: AdminService;
    let spyGameCardHandlerService: jasmine.SpyObj<GameCardHandlerService>;
    let spyMatDialog: jasmine.SpyObj<MatDialog>;
    let spyCommunicationService: jasmine.SpyObj<CommunicationService>;

    beforeEach(() => {
        spyGameCardHandlerService = jasmine.createSpyObj('GameCardHandlerService', ['getGameCards', 'hasCards', 'deleteGames', 'resetAllHighScores']);
        spyCommunicationService = jasmine.createSpyObj('CommunicationService', ['deleteAllGameCards']);
        spyMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
        TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            providers: [
                { provide: GameCardHandlerService, useValue: spyGameCardHandlerService },
                { provide: MatDialog, useValue: spyMatDialog },
            ],
        });
        service = TestBed.inject(AdminService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('deleteAllGames should call deleteGames from game communication service', () => {
        service.deleteAllGames();
        expect(spyCommunicationService.deleteAllGameCards).toHaveBeenCalled();
    });

    it('hasGameCards should call hasCards from game card handler service', () => {
        service.hasGameCards();
        expect(spyGameCardHandlerService.hasCards).toHaveBeenCalled();
    });

    it('openSettings should call call matDialog s method open', () => {
        service.openSettings();
        expect(spyMatDialog.open).toHaveBeenCalled();
    });

    it('resetAllHighScores should call resetAllHighScores from game card handler service', () => {
        service.resetAllHighScores();
        expect(spyGameCardHandlerService.resetAllHighScores).toHaveBeenCalled();
    });
});
