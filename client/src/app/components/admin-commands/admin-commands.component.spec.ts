import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { AdminService } from '@app/services/admin-service/admin.service';
import { RouterService } from '@app/services/router-service/router.service';
import { AdminCommandsComponent } from './admin-commands.component';

describe('AdminCommandsComponent', () => {
    let component: AdminCommandsComponent;
    let fixture: ComponentFixture<AdminCommandsComponent>;
    let spyAdminService: jasmine.SpyObj<AdminService>;
    let spyRouterService: jasmine.SpyObj<RouterService>;

    beforeEach(async () => {
        spyAdminService = jasmine.createSpyObj('AdminService', ['openSettings', 'deleteAllGames', 'resetAllHighScores', 'hasCards']);
        spyRouterService = jasmine.createSpyObj('RouterService', ['reloadPage']);
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [AdminCommandsComponent],
            providers: [
                {
                    provide: AdminService,
                    useValue: spyAdminService,
                },
                {
                    provide: RouterService,
                    useValue: spyRouterService,
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
        expect(spyRouterService.reloadPage).toHaveBeenCalledWith('admin');
    });
});
