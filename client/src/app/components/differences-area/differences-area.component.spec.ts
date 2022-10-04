import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimerStopwatchComponent } from '@app/components/timer-stopwatch/timer-stopwatch.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

import { DifferencesAreaComponent } from './differences-area.component';

describe('DifferencesAreaComponent', () => {
    let component: DifferencesAreaComponent;
    let fixture: ComponentFixture<DifferencesAreaComponent>;
    let spyGameInfosService: jasmine.SpyObj<GameInformationHandlerService>;

    beforeEach(async () => {
        spyGameInfosService = jasmine.createSpyObj('GameInformationHandlerService', ['setGameInformation', 'getPlayerName']);
        await TestBed.configureTestingModule({
            declarations: [DifferencesAreaComponent, TimerStopwatchComponent],
            imports: [AppMaterialModule],
            providers: [
                {
                    provide: GameInformationHandlerService,
                    useValue: spyGameInfosService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DifferencesAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
