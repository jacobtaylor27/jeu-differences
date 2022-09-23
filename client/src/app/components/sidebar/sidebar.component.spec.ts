import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { CluesAreaComponent } from '../clues-area/clues-area.component';
import { DifferencesAreaComponent } from '../differences-area/differences-area.component';
import { TimerCountdownComponent } from '../timer-countdown/timer-countdown.component';
import { TimerStopwatchComponent } from '../timer-stopwatch/timer-stopwatch.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CluesAreaComponent, TimerStopwatchComponent, TimerCountdownComponent, DifferencesAreaComponent],
            imports: [AppMaterialModule],
            providers: [TimerStopwatchComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set askedClue variable', () => {
        const expectedClueValue = 3;
        component.onClueAsked(3);
        expect(component.askedClue).toEqual(expectedClueValue);
    });
});
