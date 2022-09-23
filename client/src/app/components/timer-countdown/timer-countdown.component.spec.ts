import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
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

    it('init should start timer', fakeAsync(() => {
        const componentInstance = fixture.componentInstance;
        const countdownTimerSpy = spyOn<any>(componentInstance, 'countdownTimer');
        componentInstance.ngOnInit();
        tick(10);
        expect(countdownTimerSpy).toHaveBeenCalled();
    }));
});
