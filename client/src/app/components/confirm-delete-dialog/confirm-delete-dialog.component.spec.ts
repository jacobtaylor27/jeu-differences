import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { AdminService } from '@app/services/admin-service/admin.service';

import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog.component';

describe('ConfirmDeleteDialogComponent', () => {
    let component: ConfirmDeleteDialogComponent;
    let fixture: ComponentFixture<ConfirmDeleteDialogComponent>;
    let spyAdminService: jasmine.SpyObj<AdminService>;

    beforeEach(async () => {
        spyAdminService = jasmine.createSpyObj('AdminService', ['deleteAllGames']);
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule, HttpClientModule, RouterTestingModule],
            declarations: [ConfirmDeleteDialogComponent],
            providers: [{ provide: AdminService, useValue: spyAdminService }],
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmDeleteDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should delete all games', () => {
        component.deleteAllGames();
        expect(spyAdminService.deleteAllGames).toHaveBeenCalled();
    });
});
