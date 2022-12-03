import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { AppMaterialModule } from '@app/modules/material.module';
import { AdminService } from '@app/services/admin-service/admin.service';
import { ConfirmDeleteDialogComponent } from '@app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { AdminCommandsComponent } from './admin-commands.component';

describe('AdminCommandsComponent', () => {
    let component: AdminCommandsComponent;
    let fixture: ComponentFixture<AdminCommandsComponent>;
    let spyAdminService: jasmine.SpyObj<AdminService>;
    let spyDialog: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        spyAdminService = jasmine.createSpyObj('AdminService', [
            'openSettings',
            'deleteAllGames',
            'resetAllHighScores',
            'hasCards',
            'refreshAllGames',
        ]);
        spyDialog = jasmine.createSpyObj('MatDialog', ['open']);
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [AdminCommandsComponent],
            providers: [
                {
                    provide: AdminService,
                    useValue: spyAdminService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminCommandsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('hasCards should call hasCards from adminService', () => {
        component.hasCards();
        expect(spyAdminService.hasCards).toHaveBeenCalled();
    });

    it('onClickModifySettings should call openSettings from adminService', () => {
        component.onClickModifySettings();
        expect(spyAdminService.openSettings).toHaveBeenCalled();
    });

    it('onClickDeleteGames should call deleteAllGames from admin service', () => {
        component.onClickDeleteGames();
        expect(spyAdminService.deleteAllGames).toHaveBeenCalled();
    });

    it('onClickRefreshGames should call refreshAllGames from admin service', () => {
        component.onClickRefreshGames();
        expect(spyAdminService.refreshAllGames).toHaveBeenCalled();
    });
});
