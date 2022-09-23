import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TimerStopwatchComponent } from './timer-stopwatch.component';

describe('TimerStopwatchComponent', () => {
    let component: TimerStopwatchComponent;
    let fixture: ComponentFixture<TimerStopwatchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TimerStopwatchComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TimerStopwatchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should start at 00 : 00', fakeAsync(() => {
        component.ngOnInit();
        tick(1);
        expect(component.timerDisplay).toEqual('00 : 00');
        discardPeriodicTasks();
    }));

    it('should increment every second', fakeAsync(() => {
        const componentInstance = fixture.componentInstance;
        /* eslint-disable @typescript-eslint/no-explicit-any  */
        const calculateTimeSpy = spyOn<any>(componentInstance, 'calculateTime');
        componentInstance.ngOnInit();
        tick(0);
        expect(calculateTimeSpy).toHaveBeenCalledTimes(0);
        /* eslint-disable @typescript-eslint/no-magic-numbers -- test for 1 second */
        tick(1000);
        expect(calculateTimeSpy).toHaveBeenCalledTimes(1);
        /* eslint-disable @typescript-eslint/no-magic-numbers -- test for 1 second */
        tick(1000);
        expect(calculateTimeSpy).toHaveBeenCalledTimes(2);
        discardPeriodicTasks();
    }));

    it('should increment every second', fakeAsync(() => {
        const componentInstance = fixture.componentInstance;
        /* eslint-disable @typescript-eslint/no-explicit-any  */
        const stopTimerSpy = spyOn<any>(componentInstance, 'stopTimer');
        componentInstance.ngOnInit();
        /* eslint-disable @typescript-eslint/no-magic-numbers -- test for 1 second */
        tick(1000);
        component.ngOnDestroy();
        expect(stopTimerSpy).toHaveBeenCalled();
        discardPeriodicTasks();
    }));
});
