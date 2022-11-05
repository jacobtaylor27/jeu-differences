import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SIZE } from '@app/constants/canvas';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { Coordinate } from '@common/coordinate';
import { of, Subject } from 'rxjs';
import { DifferencesDetectionHandlerService } from './differences-detection-handler.service';

describe('DifferencesDetectionHandlerService', () => {
    let service: DifferencesDetectionHandlerService;
    let spyMatDialog: jasmine.SpyObj<MatDialog>;
    let spyCommunicationService: jasmine.SpyObj<CommunicationService>;
    let spyGameInfoHandlerService: jasmine.SpyObj<GameInformationHandlerService>;

    beforeEach(() => {
        spyMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
        spyGameInfoHandlerService = jasmine.createSpyObj('GameInformationHandlerService', ['getNbDifferences', 'getNbTotalDifferences'], {
            players: [
                { name: 'test', nbDifferences: 0 },
                { name: 'test2', nbDifferences: 0 },
            ],
            $differenceFound: new Subject<string>(),
        });
        spyCommunicationService = jasmine.createSpyObj('CommunicationService', ['validateCoordinates']);

        TestBed.configureTestingModule({
            imports: [AppMaterialModule, HttpClientModule, RouterTestingModule],
            providers: [
                { provide: MatDialog, useValue: spyMatDialog },
                { provide: GameInformationHandlerService, useValue: spyGameInfoHandlerService },
                { provide: CommunicationService, useValue: spyCommunicationService },
            ],
        });
        service = TestBed.inject(DifferencesDetectionHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set ctx', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        service.setContextImgModified(ctx);
        expect(service.contextImgModified).toEqual(ctx);
    });

    it('should set number of differences found', () => {
        service.nbDifferencesFound = 1;
        service.setNumberDifferencesFound(false, 3);
        expect(service.nbDifferencesFound).toEqual(2);
        expect(service.nbTotalDifferences).toEqual(3);
    });

    it('should reset number differences found', () => {
        service.nbDifferencesFound = 5;
        service.nbTotalDifferences = 5;
        service.resetNumberDifferencesFound();
        expect(service.nbDifferencesFound).toEqual(0);
        expect(service.nbTotalDifferences).toEqual(0);
    });

    it('should play sound', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const expectedAudio = { play: () => {} } as HTMLAudioElement;
        const spy = spyOn(expectedAudio, 'play');

        service.playSound(expectedAudio);
        expect(spy).toHaveBeenCalled();
    });

    it('should play wrong sound', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyPlaySound = spyOn(service, 'playSound').and.callFake(() => {});
        service.playWrongSound();
        expect(spyPlaySound).toHaveBeenCalled();
    });

    it('should play correct sound', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyPlaySound = spyOn(service, 'playSound').and.callFake(() => {});
        service.playCorrectSound();
        expect(spyPlaySound).toHaveBeenCalled();
    });

    it('should play wrong sound when difference not detected', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spy = spyOn(service, 'playWrongSound').and.callFake(() => {});
        service.differenceNotDetected({ x: 0, y: 0 }, ctx);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    /* eslint-disable @typescript-eslint/no-magic-numbers -- 1000 -> 1 second  */
    it('should disabled mouse for one second when difference not detected', fakeAsync(() => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const mousePosition = { x: 0, y: 0 };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyWrongPlaySound = spyOn(service, 'playWrongSound').and.callFake(() => {});
        const spyFillText = spyOn(ctx, 'fillText');
        expect(service.mouseIsDisabled).toBeFalsy();
        service.differenceNotDetected(mousePosition, ctx);
        expect(spyWrongPlaySound).toHaveBeenCalled();
        expect(spyFillText).toHaveBeenCalled();
        expect(service.mouseIsDisabled).toBeTruthy();
        tick(1000);
        expect(service.mouseIsDisabled).toBeFalsy();
    }));

    it('should play correct sound when difference not detected', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spy = spyOn(service, 'playCorrectSound').and.callFake(() => {});
        service.differenceDetected(ctx, ctx, []);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call display and clear ctx', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const spyDisplay = spyOn(Object.getPrototypeOf(service), 'displayDifferenceTemp');
        const spyClear = spyOn(Object.getPrototypeOf(service), 'clearDifference');
        const spyPlayCorrectSound = spyOn(service, 'playCorrectSound');
        service.differenceDetected(ctx, ctx, []);

        expect(spyPlayCorrectSound).toHaveBeenCalled();
        expect(spyDisplay).toHaveBeenCalled();
        expect(spyClear).toHaveBeenCalled();

        service.isGameOver = true;

        service.differenceDetected(ctx, ctx, []);
        expect(spyDisplay).toHaveBeenCalled();
        expect(spyClear).toHaveBeenCalled();
    });

    /* eslint-disable @typescript-eslint/no-magic-numbers -- 1500 -> 1.5 seconds */
    it('should draw on canvas', fakeAsync(() => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const clearRectSpy = spyOn(ctx, 'clearRect');
        const fillRectSpy = spyOn(ctx, 'fillRect');

        service['displayDifferenceTemp'](ctx, [{ x: 1, y: 3 }]);
        tick(1500);
        expect(fillRectSpy).toHaveBeenCalled();
        tick(1500);
        expect(clearRectSpy).toHaveBeenCalled();
    }));

    it('should clear on canvas', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const clearRectSpy = spyOn(ctx, 'clearRect');
        service['clearDifference'](ctx, [{ x: 1, y: 3 }]);
        expect(clearRectSpy).toHaveBeenCalled();
    });

    it('should open dialog', () => {
        service.openGameOverDialog();
        expect(spyMatDialog.open).toHaveBeenCalled();
    });

    it('should verify with server if coord is not valid', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        spyCommunicationService.validateCoordinates.and.callFake(() => {
            return of({} as HttpResponse<{ difference: Coordinate[]; isGameOver: boolean; differencesLeft: number }>);
        });

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyDifferenceNotDetected = spyOn(service, 'differenceNotDetected').and.callFake(() => {});
        service.getDifferenceValidation('1', { x: 0, y: 0 }, ctx);
        expect(spyDifferenceNotDetected).toHaveBeenCalled();
    });

    it('should verify with server if coord is valid', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        spyCommunicationService.validateCoordinates.and.callFake(() => {
            return of({ body: { difference: [{ x: 0, y: 0 }], isGameOver: false, differencesLeft: 1 } } as HttpResponse<{
                difference: Coordinate[];
                isGameOver: boolean;
                differencesLeft: number;
            }>);
        });
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyDifferenceDetected = spyOn(service, 'differenceDetected').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spySetNbDifferences = spyOn(service, 'setNumberDifferencesFound').and.callFake(() => {});
        service.getDifferenceValidation('1', { x: 0, y: 0 }, ctx);
        expect(spyDifferenceDetected).toHaveBeenCalled();
        expect(spySetNbDifferences).toHaveBeenCalled();
    });

    it('should verify with server if coord is valid and game over', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        spyCommunicationService.validateCoordinates.and.callFake(() => {
            return of({ body: { difference: [{ x: 0, y: 0 }], isGameOver: true, differencesLeft: 1 } } as HttpResponse<{
                difference: Coordinate[];
                isGameOver: boolean;
                differencesLeft: number;
            }>);
        });

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyDifferenceDetected = spyOn(service, 'differenceDetected').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyOpenDialog = spyOn(service, 'openGameOverDialog').and.callFake(() => {});
        service.getDifferenceValidation('1', { x: 0, y: 0 }, ctx);
        expect(spyDifferenceDetected).toHaveBeenCalled();
        expect(spyOpenDialog).toHaveBeenCalled();
    });
});
