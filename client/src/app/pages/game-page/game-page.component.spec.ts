import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CluesAreaComponent } from '@app/components/clues-area/clues-area.component';
import { DifferencesAreaComponent } from '@app/components/differences-area/differences-area.component';
import { ExitGameButtonComponent } from '@app/components/exit-game-button/exit-game-button.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { TimerCountdownComponent } from '@app/components/timer-countdown/timer-countdown.component';
import { TimerStopwatchComponent } from '@app/components/timer-stopwatch/timer-stopwatch.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationService } from '@app/services/communication/communication.service';
import { of } from 'rxjs';
import { GamePageComponent } from './game-page.component';
import SpyObj = jasmine.SpyObj;

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let communicationServiceSpy: SpyObj<CommunicationService>;

    beforeEach(async () => {
        communicationServiceSpy = jasmine.createSpyObj('ExampleService', ['getTimeValue']);
        communicationServiceSpy.getTimeValue.and.returnValue(of({ title: '', body: '' }));

        await TestBed.configureTestingModule({
            declarations: [
                GamePageComponent,
                SidebarComponent,
                PlayAreaComponent,
                CluesAreaComponent,
                DifferencesAreaComponent,
                ExitGameButtonComponent,
                TimerCountdownComponent,
                TimerStopwatchComponent,
            ],
            imports: [RouterTestingModule, HttpClientModule, AppMaterialModule],
            providers: [{ provide: CommunicationService, useValue: communicationServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call getTime when page is loaded', () => {
        component.getTimerValue();
        expect(communicationServiceSpy.getTimeValue).toHaveBeenCalled();
    });
});
