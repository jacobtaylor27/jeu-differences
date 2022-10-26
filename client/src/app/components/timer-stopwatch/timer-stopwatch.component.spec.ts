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

});
