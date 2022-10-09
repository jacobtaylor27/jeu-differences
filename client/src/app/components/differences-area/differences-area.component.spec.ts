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
        spyGameInfosService = jasmine.createSpyObj('GameInformationHandlerService', ['setGameInformation', 'getPlayerName']);
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
                    differenceDetectionHandlerSpy,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DifferencesAreaComponent);
        component = fixture.componentInstance;
        spyGameInfosService.gameInformation = {
            id: '1',
            name: 'test',
            idOriginalBmp: 'imageName',
            idEditedBmp: '1',
            idDifferenceBmp: '1',
            soloScore: [
                {
                    playerName: 'test2',
                    time: 10,
                },
                {
                    playerName: 'test',
                    time: 10,
                },
            ],
            multiplayerScore: [
                {
                    playerName: 'test2',
                    time: 10,
                },
                {
                    playerName: 'test',
                    time: 10,
                },
            ],
            differenceRadius: 3,
            differences: [],
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
