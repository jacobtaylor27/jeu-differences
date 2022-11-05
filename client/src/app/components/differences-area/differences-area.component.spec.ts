/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimerStopwatchComponent } from '@app/components/timer-stopwatch/timer-stopwatch.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { Subject } from 'rxjs';

import { DifferencesAreaComponent } from './differences-area.component';

describe('DifferencesAreaComponent', () => {
    let component: DifferencesAreaComponent;
    let fixture: ComponentFixture<DifferencesAreaComponent>;
    let spyGameInfosService: jasmine.SpyObj<GameInformationHandlerService>;
    let differenceDetectionHandlerSpy: jasmine.SpyObj<DifferencesDetectionHandlerService>;
    beforeEach(async () => {
        spyGameInfosService = jasmine.createSpyObj(
            'GameInformationHandlerService',
            ['setGameInformation', 'getPlayer', 'getOpponent', 'getNbTotalDifferences', 'getNbDifferences'],
            {
                $differenceFound: new Subject<string>(),
            },
        );
        differenceDetectionHandlerSpy = jasmine.createSpyObj('DifferencesDetectionHandlerService', [
            'resetNumberDifferencesFound',
            'resetNumberDifferencesFound',
            'setNumberDifferencesFound',
        ]);
        spyGameInfosService.getPlayer.and.callFake(() => {
            return { name: 'test', nbDifferences: 0 };
        });
        spyGameInfosService.getOpponent.and.callFake(() => {
            return { name: 'test2', nbDifferences: 0 };
        });
        spyGameInfosService.getNbDifferences.and.returnValue(0);
        spyGameInfosService.getNbTotalDifferences.and.returnValue(10);
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
        expect(component.players[0].nbDifference).toEqual('0 / 10');
    });

    it('should set the nb of differences found during the game', () => {
        component.players = [{ name: 'test', nbDifference: '0/10' }];
        spyOn(Object.getPrototypeOf(component), 'getPlayerIndex').and.callFake(() => 0);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyNbDifferenceFound = spyOn(Object.getPrototypeOf(component), 'setNbDifferencesFound').and.callFake(() => '1/10');
        spyGameInfosService.$differenceFound.subscribe(() => {
            expect(spyNbDifferenceFound).toHaveBeenCalled();
        });
        spyGameInfosService.$differenceFound.next('test');
    });
});
