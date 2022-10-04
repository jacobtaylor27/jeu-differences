import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { Vec2 } from '@app/interfaces/vec2';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { GameMode } from '@common/game-mode';

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let gameInformationHandlerServiceSpy: jasmine.SpyObj<GameInformationHandlerService>;

    let mouseEvent: MouseEvent;

    beforeEach(async () => {
        gameInformationHandlerServiceSpy = jasmine.createSpyObj('GameInformationHandlerService', [
            'getGameMode',
            'getGameName',
            'getPlayerName',
            'getOriginalBmp',
            'getOriginalBmpId',
            'getModifiedBmpId',
            'getGameInformation',
        ]);
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            imports: [RouterTestingModule, HttpClientModule],
            providers: [
                {
                    provide: GameInformationHandlerService,
                    useValue: gameInformationHandlerServiceSpy,
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        gameInformationHandlerServiceSpy.gameInformation = {
            id: '1',
            name: 'test',
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            idDifferenceBmp: 'difference',
            soloScore: [],
            multiplayerScore: [],
            differenceRadius: 2,
            differences: [],
        };
        gameInformationHandlerServiceSpy.gameMode = GameMode.Classic;
        gameInformationHandlerServiceSpy.playerName = 'test';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('mouseHitDetect should assign the mouse position to mousePosition variable', () => {
        const expectedPosition: Vec2 = { x: 100, y: 200 };
        mouseEvent = {
            offsetX: expectedPosition.x,
            offsetY: expectedPosition.y,
            button: 0,
        } as MouseEvent;
        component.mouseHitDetect(mouseEvent, 'original');
        expect(component.mousePosition).toEqual(expectedPosition);
    });

    it('buttonDetect should modify the buttonPressed variable', () => {
        const expectedKey = 'a';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        component.buttonDetect(buttonEvent);
        expect(component.buttonPressed).toEqual(expectedKey);
    });
});
