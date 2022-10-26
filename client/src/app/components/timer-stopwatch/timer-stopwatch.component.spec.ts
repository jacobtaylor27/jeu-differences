import { ComponentFixture, TestBed,  } from '@angular/core/testing';
import { CluesAreaComponent } from '@app/components/clues-area/clues-area.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { TimerStopwatchComponent } from './timer-stopwatch.component';

describe('TimerStopwatchComponent', () => {
    let component: TimerStopwatchComponent;
    let fixture: ComponentFixture<TimerStopwatchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TimerStopwatchComponent, CluesAreaComponent],
            imports: [AppMaterialModule],
        }).compileComponents();

        fixture = TestBed.createComponent(TimerStopwatchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    // it('should start at 00 : 00', fakeAsync(() => {
    //     component.ngOnInit();
    //     tick(1);
    //     expect(component.timerDisplay).toEqual('00 : 00');
    //     discardPeriodicTasks();
    // }));

    // it('should increment every second', fakeAsync(() => {
    //     const componentInstance = fixture.componentInstance;
    //     const calculateTimeSpy = spyOn(Object.getPrototypeOf(componentInstance), 'calculateTime');
    //     componentInstance.ngOnInit();
    //     tick(0);
    //     expect(calculateTimeSpy).toHaveBeenCalledTimes(0);
    //     /* eslint-disable @typescript-eslint/no-magic-numbers -- test for 1 second */
    //     tick(1000);
    //     expect(calculateTimeSpy).toHaveBeenCalledTimes(1);
    //     /* eslint-disable @typescript-eslint/no-magic-numbers -- test for 1 second */
    //     tick(1000);
    //     expect(calculateTimeSpy).toHaveBeenCalledTimes(2);
    //     discardPeriodicTasks();
    // }));

    // it('should increment every second', fakeAsync(() => {
    //     const componentInstance = fixture.componentInstance;
    //     const stopTimerSpy = spyOn(Object.getPrototypeOf(componentInstance), 'stopTimer');
    //     componentInstance.ngOnInit();
    //     /* eslint-disable @typescript-eslint/no-magic-numbers -- test for 1 second */
    //     tick(1000);
    //     component.ngOnInit();
    //     expect(stopTimerSpy).toHaveBeenCalled();
    //     discardPeriodicTasks();
    // }));
});
