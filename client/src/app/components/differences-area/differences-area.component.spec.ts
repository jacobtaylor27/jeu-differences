/* eslint-disable @typescript-eslint/no-magic-numbers -- tests with nb of differences */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimerStopwatchComponent } from '@app/components/timer-stopwatch/timer-stopwatch.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { GameMode } from '@common/game-mode';
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
                $playerLeft: new Subject<string>(),
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
        expect(component.players[0].nbDifference).toEqual('0');
    });

    it('should set the nb of differences found during the game', () => {
        component.players = [{ name: 'test', nbDifference: '0/10' }];
        spyOn(Object.getPrototypeOf(component), 'getPlayerIndex').and.callFake(() => 0);
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spyNbDifferenceFound = spyOn(Object.getPrototypeOf(component), 'setNbDifferencesFound').and.callFake(() => '1/10');
        spyGameInfosService.$differenceFound.subscribe(() => {
            expect(spyNbDifferenceFound).toHaveBeenCalled();
        });
        spyGameInfosService.$differenceFound.next('test');
    });

    it('should not set the nb of differences found during the game if the player is not find', () => {
        component.players = [{ name: 'test', nbDifference: '0/10' }];
        spyOn(Object.getPrototypeOf(component), 'getPlayerIndex').and.callFake(() => -1);
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spyNbDifferenceFound = spyOn(Object.getPrototypeOf(component), 'setNbDifferencesFound').and.callFake(() => '1/10');
        spyGameInfosService.$differenceFound.subscribe(() => {
            expect(spyNbDifferenceFound).not.toHaveBeenCalled();
        });
        spyGameInfosService.$differenceFound.next('test');
    });

    it('should not find a player and return -1 as index', () => {
        component.players = [{ name: 'test', nbDifference: '0/10' }];
        expect(component.getPlayerIndex('test2')).toEqual(-1);
        expect(component.getPlayerIndex('test')).toEqual(0);
    });

    it('should return string empty when player not found', () => {
        spyGameInfosService.getNbDifferences.and.callFake(() => undefined);
        expect(component.setNbDifferencesFound('')).toEqual('');
    });

    it('should set nb of differences on limited and multi mode ', () => {
        spyGameInfosService.gameMode = GameMode.LimitedTime;

        spyGameInfosService.getNbDifferences.and.callFake(() => 1);
        expect(component.setNbDifferencesFoundLimited()).toEqual('1');
    });

    
    it('should call setNbDifferencesFoundLimited on $playerLeft.next', () => {
        spyGameInfosService.gameMode = GameMode.LimitedTime;
        spyGameInfosService.isMulti = true;
        const newComponent = new DifferencesAreaComponent(spyGameInfosService, differenceDetectionHandlerSpy);
        const spyNbDifferenceFound = spyOn(newComponent, 'setNbDifferencesFoundLimited').and.callFake(() => '1/10');
        spyGameInfosService.$playerLeft.subscribe(() => {
            expect(spyNbDifferenceFound).toHaveBeenCalled();
        });

        spyGameInfosService.$playerLeft.next();
    });

    it('should call setNbDifferencesFoundLimited on $differenceFound.next', () => {
        spyGameInfosService.gameMode = GameMode.LimitedTime;
        spyGameInfosService.isMulti = true;
        const newComponent = new DifferencesAreaComponent(spyGameInfosService, differenceDetectionHandlerSpy);
        const spyNbDifferenceFound = spyOn(newComponent, 'setNbDifferencesFoundLimited').and.callFake(() => '1/10');
        spyGameInfosService.$differenceFound.subscribe(() => {
            expect(spyNbDifferenceFound).toHaveBeenCalled();
        });

        spyGameInfosService.$differenceFound.next('test');
    });
});
