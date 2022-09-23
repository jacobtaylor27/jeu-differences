import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ExitGameButtonComponent } from './exit-game-button.component';

describe('ExitGameButtonComponent', () => {
    let component: ExitGameButtonComponent;
    let fixture: ComponentFixture<ExitGameButtonComponent>;
    const model = {};

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExitGameButtonComponent],
            imports: [MatDialogModule],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: model }],
        }).compileComponents();

        fixture = TestBed.createComponent(ExitGameButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('dialog should open when exit button is clicked', () => {
        const openDialogSpy = spyOn(component.matDialog, 'open');
        component.onExit();
        expect(openDialogSpy).toHaveBeenCalled();
    });
});
