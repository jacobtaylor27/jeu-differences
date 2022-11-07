import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { AppMaterialModule } from '@app/modules/material.module';

import { PlayerLeftSnackbarComponent } from './player-left-snackbar.component';

describe('PlayerLeftSnackbarComponent', () => {
    let component: PlayerLeftSnackbarComponent;
    let fixture: ComponentFixture<PlayerLeftSnackbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayerLeftSnackbarComponent],
            imports: [MatDialogModule, AppMaterialModule,],
            providers: [{provide: MatSnackBarRef, useValue: {}},{provide: MAT_SNACK_BAR_DATA, useValue: {}}]
        }).compileComponents();

        fixture = TestBed.createComponent(PlayerLeftSnackbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
