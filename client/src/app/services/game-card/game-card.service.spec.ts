import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { gameCard1 } from '@app/constants/game-card-constant.spec';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationService } from '@app/services/communication/communication.service';
import { of } from 'rxjs';
import { GameCardService } from './game-card.service';

describe('GameCardService', () => {
    let service: GameCardService;
    let spyMatDialog: jasmine.SpyObj<MatDialog>;
    let spyCommunicationService: jasmine.SpyObj<CommunicationService>;

    beforeEach(() => {
        spyCommunicationService = jasmine.createSpyObj<CommunicationService>('CommunicationService', ['deleteGame', 'refreshSingleGame']);
        spyMatDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
        TestBed.configureTestingModule({
            imports: [AppMaterialModule, NoopAnimationsModule, HttpClientModule],
            providers: [
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
        service.deleteGame(gameCard1.gameInformation.id);
        expect(spyCommunicationService.deleteGame).toHaveBeenCalled();
    });
});
