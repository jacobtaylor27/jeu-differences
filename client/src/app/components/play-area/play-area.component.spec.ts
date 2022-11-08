/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SIZE } from '@app/constants/canvas';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
import { GameMode } from '@common/game-mode';

import { of } from 'rxjs';
import { Socket } from 'socket.io-client';

class SocketClientServiceMock extends CommunicationSocketService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    override connect() {}
}
describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let gameInformationHandlerServiceSpy: jasmine.SpyObj<GameInformationHandlerService>;
    let spyMouseHandlerService: jasmine.SpyObj<MouseHandlerService>;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;
    let differenceService: jasmine.SpyObj<DifferencesDetectionHandlerService>;
    let socketHelper: SocketTestHelper;
    let socketServiceMock: SocketClientServiceMock;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['getImgData']);
        spyMouseHandlerService = jasmine.createSpyObj('MouseHandlerService', ['mouseHitDetect']);
        differenceService = jasmine.createSpyObj('DifferencesDetectionHandlerService', [
            'setContextImgModified',
            'setNumberDifferencesFound',
            'differenceDetected',
        ]);
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
            imports: [RouterTestingModule, HttpClientModule, MatDialogModule],

            providers: [
                {
                    provide: GameInformationHandlerService,
                    useValue: gameInformationHandlerServiceSpy,
                },
                {
                    provide: MouseHandlerService,
                    useValue: spyMouseHandlerService,
                },
                {
                    provide: CommunicationService,
                    useValue: communicationServiceSpy,
                },
                {
                    provide: DifferencesDetectionHandlerService,
                    useValue: differenceService,
                },
                { provide: CommunicationSocketService, usValue: socketServiceMock },
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
            thumbnail: 'string',
            idEditedBmp: 'edited',
            soloScore: [],
            multiplayerScore: [],
            nbDifferences: 1,
            isMulti: false,
        };
        gameInformationHandlerServiceSpy.gameMode = GameMode.Classic;
        gameInformationHandlerServiceSpy.players = [{ name: 'test', nbDifferences: 0 }];
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display image afterViewInit', () => {
        const spyDisplayImage = spyOn(component, 'displayImage').and.callFake(() => {});
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(component, 'getContextImgModified').and.callFake(() => ctx);
        spyOn(component, 'getContextImgOriginal').and.callFake(() => ctx);
        spyOn(component, 'getContextDifferences').and.callFake(() => ctx);
        differenceService.setContextImgModified.and.callFake(() => {});
        component.ngAfterViewInit();

        expect(spyDisplayImage).toHaveBeenCalledTimes(3);
        expect(differenceService.setContextImgModified).toHaveBeenCalled();
    });

    it('should return width', () => {
        expect(component.width).toEqual(SIZE.x);
    });

    it('should return height', () => {
        expect(component.height).toEqual(SIZE.y);
    });

    it('buttonDetect should modify the buttonPressed variable', () => {
        const expectedKey = 'a';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        component.buttonDetect(buttonEvent);
        expect(component.buttonPressed).toEqual(expectedKey);
    });

    it('on click should call mouseHandlerService', () => {
        differenceService.mouseIsDisabled = false;
        const mouseEvent = {
            offsetX: 10,
            offsetY: 10,
            button: 0,
        } as MouseEvent;

        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const spyGetCtxOriginal = spyOn(component, 'getContextOriginal').and.callFake(() => ctx);
        component.onClick(mouseEvent, 'original');
        expect(spyGetCtxOriginal).toHaveBeenCalled();
        expect(spyMouseHandlerService.mouseHitDetect).toHaveBeenCalled();

        const spyGetCtxModified = spyOn(component, 'getContextModified').and.callFake(() => ctx);
        component.onClick(mouseEvent, 'modified');
        expect(spyGetCtxModified).toHaveBeenCalled();
    });

    it('should get image form server', () => {
        communicationServiceSpy.getImgData.and.callFake(() => {
            return of({ body: { data: [0], height: 1, width: 1 } } as HttpResponse<{ width: number; height: number; data: number[] }>);
        });
        component.getImageData('');
        expect(communicationServiceSpy.getImgData).toHaveBeenCalled();
    });

    it('should display image', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(component, 'getContextOriginal').and.callFake(() => ctx);
        spyOn(component, 'getContextModified').and.callFake(() => ctx);

        const spyGetImage = spyOn(component, 'getImageData').and.callFake(() => {
            return of({ body: { data: [0, 0, 0, 0], height: 1, width: 1 } } as HttpResponse<{ width: number; height: number; data: number[] }>);
        });

        component.displayImage(true, ctx);
        expect(spyGetImage).toHaveBeenCalledWith(gameInformationHandlerServiceSpy.getOriginalBmpId());
        expect(gameInformationHandlerServiceSpy.getOriginalBmpId).toHaveBeenCalled();

        component.displayImage(false, ctx);
        expect(spyGetImage).toHaveBeenCalledWith(gameInformationHandlerServiceSpy.getModifiedBmpId());
        expect(gameInformationHandlerServiceSpy.getModifiedBmpId).toHaveBeenCalled();
    });

    it('should not display image if response is empty', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(component, 'getContextOriginal').and.callFake(() => ctx);
        spyOn(component, 'getContextModified').and.callFake(() => ctx);

        const spyGetImage = spyOn(component, 'getImageData').and.callFake(() => {
            return of({} as HttpResponse<{ width: number; height: number; data: number[] }>);
        });

        component.displayImage(true, ctx);
        expect(spyGetImage).toHaveBeenCalledWith(gameInformationHandlerServiceSpy.getOriginalBmpId());
        expect(gameInformationHandlerServiceSpy.getOriginalBmpId).toHaveBeenCalled();

        component.displayImage(false, ctx);
        expect(spyGetImage).toHaveBeenCalledWith(gameInformationHandlerServiceSpy.getModifiedBmpId());
        expect(gameInformationHandlerServiceSpy.getModifiedBmpId).toHaveBeenCalled();
    });

    it('should return context', () => {
        spyOn(component, 'displayImage').and.callFake(() => {});
        spyOn(component, 'ngAfterViewInit').and.callFake(() => {});
        fixture.detectChanges();

        const expected = component.canvasImgDifference.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        expect(component.getContextDifferences()).toEqual(expected);
    });

    it('should return context', () => {
        spyOn(component, 'displayImage').and.callFake(() => {});
        spyOn(component, 'ngAfterViewInit').and.callFake(() => {});
        fixture.detectChanges();

        const expected = component.canvasImgOriginal.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        expect(component.getContextImgOriginal()).toEqual(expected);
    });

    it('should return context', () => {
        spyOn(component, 'displayImage').and.callFake(() => {});
        spyOn(component, 'ngAfterViewInit').and.callFake(() => {});
        fixture.detectChanges();

        const expected = component.canvasImgModified.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        expect(component.getContextImgModified()).toEqual(expected);
    });

    it('should return context', () => {
        spyOn(component, 'displayImage').and.callFake(() => {});
        spyOn(component, 'ngAfterViewInit').and.callFake(() => {});
        fixture.detectChanges();

        const expected = component.canvasOriginal.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        expect(component.getContextOriginal()).toEqual(expected);
    });

    it('should return context', () => {
        spyOn(component, 'displayImage').and.callFake(() => {});
        spyOn(component, 'ngAfterViewInit').and.callFake(() => {});
        fixture.detectChanges();

        const expected = component.canvasModified.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        expect(component.getContextModified()).toEqual(expected);
    });
});
