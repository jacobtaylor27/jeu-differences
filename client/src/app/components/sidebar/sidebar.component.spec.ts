import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CluesAreaComponent } from '@app/components/clues-area/clues-area.component';
import { DifferencesAreaComponent } from '@app/components/differences-area/differences-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { TimerCountdownComponent } from '@app/components/timer-countdown/timer-countdown.component';
import { TimerStopwatchComponent } from '@app/components/timer-stopwatch/timer-stopwatch.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let spyGameInfosService: jasmine.SpyObj<GameInformationHandlerService>;

    beforeEach(async () => {
        spyGameInfosService = jasmine.createSpyObj('GameInformationHandlerService', ['getGameName', 'setPlayerName', 'getGameMode', 'getPlayerName']);

        await TestBed.configureTestingModule({
            declarations: [SidebarComponent, CluesAreaComponent, TimerStopwatchComponent, TimerCountdownComponent, DifferencesAreaComponent],
            imports: [AppMaterialModule],
            providers: [
                {
                    provide: GameInformationHandlerService,
                    useValue: spyGameInfosService,
                },
            ],
        }).compileComponents();

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
