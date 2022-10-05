import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { Vec2 } from '@app/interfaces/vec2';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { GameMode } from '@common/game-mode';
import { of } from 'rxjs';

fdescribe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let gameInformationHandlerServiceSpy: jasmine.SpyObj<GameInformationHandlerService>;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;

    const dialogMock = {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        close: () => {},
    };

    let mouseEvent: MouseEvent;

    beforeEach(async () => {
        communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['getImgData']);
        gameInformationHandlerServiceSpy = jasmine.createSpyObj('GameInformationHandlerService', [
            'getGameMode',
            'getGameName',
            'getPlayerName',
            'getOriginalBmp',
            'getOriginalBmpId',
            'getModifiedBmpId',
            'getGameInformation',
        ]);

        communicationServiceSpy.createGameRoom.and.callFake(() => {
            return of({ body: { id: '' } } as HttpResponse<any>);
        });

        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            imports: [RouterTestingModule, HttpClientModule, MatDialogModule],

            providers: [
                {
                    provide: MatDialogRef,
                    useValue: dialogMock,
                },
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
