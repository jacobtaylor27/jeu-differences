import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerLeftSnackbarComponent } from './player-left-snackbar.component';

describe('PlayerLeftSnackbarComponent', () => {
    let component: PlayerLeftSnackbarComponent;
    let fixture: ComponentFixture<PlayerLeftSnackbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayerLeftSnackbarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PlayerLeftSnackbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
