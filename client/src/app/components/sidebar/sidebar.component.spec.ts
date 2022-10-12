import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CluesAreaComponent } from '@app/components/clues-area/clues-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
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
            declarations: [SidebarComponent, CluesAreaComponent, TimerStopwatchComponent],
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
