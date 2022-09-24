import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { AppMaterialModule } from '@app/modules/material.module';
import { AdminService } from './admin.service';
import { GameCardHandlerService } from './game-card-handler.service';

describe('AdminService', () => {
    let service: AdminService;
    let spyGameCardHandlerService: jasmine.SpyObj<GameCardHandlerService>;
    let spyMatDialog: jasmine.SpyObj<MatDialog>;

    beforeEach(() => {
        spyGameCardHandlerService = jasmine.createSpyObj('GameCardHandlerService', ['getGameCards', 'hasCards', 'deleteGames', 'resetAllHighScores']);
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

    it('deleteAllGames should call deleteGames from game card handler service', () => {
        service.deleteAllGames();
        expect(spyGameCardHandlerService.deleteGames).toHaveBeenCalled();
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
