import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimerStopwatchComponent } from '@app/components/timer-stopwatch/timer-stopwatch.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

import { DifferencesAreaComponent } from './differences-area.component';

describe('DifferencesAreaComponent', () => {
    let component: DifferencesAreaComponent;
    let fixture: ComponentFixture<DifferencesAreaComponent>;
    let spyGameInfosService: jasmine.SpyObj<GameInformationHandlerService>;
    let differenceDetectionHandlerSpy: jasmine.SpyObj<DifferencesDetectionHandlerService>;

    beforeEach(async () => {
        spyGameInfosService = jasmine.createSpyObj('GameInformationHandlerService', ['setGameInformation', 'getPlayerName', 'getNbDifferences']);
        differenceDetectionHandlerSpy = jasmine.createSpyObj('DifferencesDetectionHandlerService', [
            'resetNumberDifferencesFound',
            'setNumberDifferencesFound',
        ]);
        await TestBed.configureTestingModule({
            declarations: [DifferencesAreaComponent, TimerStopwatchComponent],
            imports: [AppMaterialModule],
            providers: [
                {
                    provide: GameInformationHandlerService,
                    useValue: spyGameInfosService,
                },
                {
                    provide: DifferencesDetectionHandlerService,
                    useValue: differenceDetectionHandlerSpy,
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

    it('should set the nb of differences found at the beginning of the game', () => {
        spyGameInfosService.getNbDifferences.and.returnValue(10)
        expect(component.setNbDifferencesFound()).toEqual('0 / 10');
    });

    it('should set the nb of differences found during the game', () => {
        differenceDetectionHandlerSpy.nbDifferencesFound = 1;
        spyGameInfosService.getNbDifferences.and.returnValue(10)
        expect(component.setNbDifferencesFound()).toEqual('1 / 10');
    });

    it('should set the nb of differences when game is over', () => {
        differenceDetectionHandlerSpy.isGameOver = true;
        differenceDetectionHandlerSpy.nbDifferencesFound = 5;
        spyGameInfosService.getNbDifferences.and.returnValue(10)

        expect(component.setNbDifferencesFound()).toEqual('5 / 10');
    });
});
