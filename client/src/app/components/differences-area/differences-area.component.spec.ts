import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { TimerStopwatchComponent } from '../timer-stopwatch/timer-stopwatch.component';

import { DifferencesAreaComponent } from './differences-area.component';

describe('DifferencesAreaComponent', () => {
    let component: DifferencesAreaComponent;
    let fixture: ComponentFixture<DifferencesAreaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DifferencesAreaComponent, TimerStopwatchComponent],
            imports: [AppMaterialModule],
        }).compileComponents();

        fixture = TestBed.createComponent(DifferencesAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
