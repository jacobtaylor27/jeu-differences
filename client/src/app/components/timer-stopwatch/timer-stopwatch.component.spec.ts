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
        const calculateTimeSpy = spyOn<unknown>(componentInstance, 'calculateTime');
        componentInstance.ngOnInit();
        tick(0);
        expect(calculateTimeSpy).toHaveBeenCalledTimes(0);
        tick(1000);
        expect(calculateTimeSpy).toHaveBeenCalledTimes(1);
        tick(1000);
        expect(calculateTimeSpy).toHaveBeenCalledTimes(2);
        discardPeriodicTasks();
    }));

    it('should increment every second', fakeAsync(() => {
        const componentInstance = fixture.componentInstance;
        const stopTimerSpy = spyOn<unknown>(componentInstance, 'stopTimer');
        componentInstance.ngOnInit();
        tick(1000);
        component.ngOnDestroy();
        expect(stopTimerSpy).toHaveBeenCalled();
        discardPeriodicTasks();
    }));
});
