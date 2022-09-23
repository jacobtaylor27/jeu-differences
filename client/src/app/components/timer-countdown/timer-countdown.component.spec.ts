import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
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
        const countdownTimerSpy = spyOn<unknown>(componentInstance, 'countdownTimer');
        componentInstance.ngOnInit();
        tick(10);
        expect(countdownTimerSpy).toHaveBeenCalled();
        discardPeriodicTasks();
    }));

    it('onDestroy should stopTimer', fakeAsync(() => {
        const componentInstance = fixture.componentInstance;
        const stopTimerSpy = spyOn<unknown>(componentInstance, 'stopTimer');
        componentInstance.ngOnInit();
        componentInstance.ngOnDestroy();
        expect(stopTimerSpy).toHaveBeenCalled();
        discardPeriodicTasks();
    }));

    it('moreThanFiveSeconds should return true is value is more than 5 seconds', () => {
        component['secondsLeft'] = 6;
        expect(component.moreThanFiveSeconds()).toBeTrue();
    });

    it('moreThanFiveSeconds should return false is value is less than 5 seconds', () => {
        component['secondsLeft'] = 2;
        expect(component.moreThanFiveSeconds()).toBeFalse();
    });

    it('gameOver should be called when the countdown is done', fakeAsync(() => {
        const componentInstance = fixture.componentInstance;
        componentInstance['timerAdmin'] = '18';
        componentInstance['countdownTimer']();
        const stopTimerSpy = spyOn<unknown>(componentInstance, 'gameOver');
        tick(20000);
        expect(stopTimerSpy).toHaveBeenCalled();
        discardPeriodicTasks();
    }));

    it('gameOver should open dialog', () => {
        const openDialogSpy = spyOn(component['matDialog'], 'open');
        component['gameOver']();
        expect(openDialogSpy).toHaveBeenCalled();
    });
});
