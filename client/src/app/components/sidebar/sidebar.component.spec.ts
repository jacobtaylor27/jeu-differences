import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CluesAreaComponent } from '@app/components/clues-area/clues-area.component';
import { DifferencesAreaComponent } from '@app/components/differences-area/differences-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let spyGameInfosService: jasmine.SpyObj<GameInformationHandlerService>;
    let spyDifferencesDetection: jasmine.SpyObj<DifferencesDetectionHandlerService>;

    beforeEach(async () => {
        spyGameInfosService = jasmine.createSpyObj('GameInformationHandlerService', ['getGameName', 'setPlayerName', 'getGameMode', 'getPlayerName', 'getNbDifferences']);
        spyDifferencesDetection = jasmine.createSpyObj('DifferencesDetectionHandlerService', ['nbDifferencesFound', 'resetNumberDifferencesFound']);
        await TestBed.configureTestingModule({
            declarations: [SidebarComponent, CluesAreaComponent, DifferencesAreaComponent],
            imports: [AppMaterialModule, HttpClientTestingModule],
            providers: [
                {
                    provide: GameInformationHandlerService,
                    useValue: spyGameInfosService,
                },
                {
                    provide: DifferencesDetectionHandlerService,
                    useValue: spyDifferencesDetection,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        spyGameInfosService.gameInformation = {
            id: '1',
            name: 'test',
            thumbnail: 'image',
            idOriginalBmp: 'imageName',
            idEditedBmp: '1',
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
            nbDifferences: 10,
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
