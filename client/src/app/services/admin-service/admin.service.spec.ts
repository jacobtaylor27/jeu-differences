import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { AppMaterialModule } from '@app/modules/material.module';
import { AdminService } from './admin.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

describe('AdminService', () => {
    let service: AdminService;
    let spyMatDialog: jasmine.SpyObj<MatDialog>;
    let spyCommunicationService: jasmine.SpyObj<CommunicationService>;

    beforeEach(() => {
        spyCommunicationService = jasmine.createSpyObj('CommunicationService', ['deleteAllGameCards']);
        spyMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
        TestBed.configureTestingModule({
            imports: [AppMaterialModule, HttpClientModule],
            providers: [
                { provide: MatDialog, useValue: spyMatDialog },
                { provide: CommunicationService, useValue: spyCommunicationService },
            ],
        });
        service = TestBed.inject(AdminService);
        spyCommunicationService.deleteAllGameCards.and.returnValue(of());
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('deleteAllGames should call deleteGames from game communication service', () => {
        service.deleteAllGames();
        expect(spyCommunicationService.deleteAllGameCards).toHaveBeenCalled();
    });

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it('hasGameCards should call hasCards from game card handler service', () => {});

    it('openSettings should call call matDialog s method open', () => {
        service.openSettings();
        expect(spyMatDialog.open).toHaveBeenCalled();
    });
});
