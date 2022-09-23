import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TimerCountdownComponent } from './timer-countdown.component';

describe('TimerCountdownComponent', () => {
    let component: TimerCountdownComponent;
    let fixture: ComponentFixture<TimerCountdownComponent>;
    const model = {};

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TimerCountdownComponent],
            imports: [MatDialogModule],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: model }],
        }).compileComponents();

        fixture = TestBed.createComponent(TimerCountdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });
});
