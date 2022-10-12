import { HttpClientModule } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SIZE } from '@app/constants/canvas';
import { AppMaterialModule } from '@app/modules/material.module';
import { Subject } from 'rxjs';
import { CommunicationService } from '../communication/communication.service';
import { TimerService } from '../timer.service';
import { DifferencesDetectionHandlerService } from './differences-detection-handler.service';

describe('DifferencesDetectionHandlerService', () => {
    let service: DifferencesDetectionHandlerService;
    let spyMatDialog: jasmine.SpyObj<MatDialog>;
    let spyCommunicationService: jasmine.SpyObj<CommunicationService>;
    let spyTimer: jasmine.SpyObj<TimerService>;

    beforeEach(() => {
        spyMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
        spyCommunicationService = jasmine.createSpyObj('CommunicationService', ['validateCoordinates']);
        spyTimer = jasmine.createSpyObj('TimerService', ['setNbOfDifferencesFound'], {
            differenceFind: new Subject(),
            gameOver: new Subject(),
        });
        TestBed.configureTestingModule({
            imports: [AppMaterialModule, HttpClientModule, RouterTestingModule],
            providers: [
                { provide: MatDialog, useValue: spyMatDialog },
                { provide: TimerService, useValue: spyTimer },
                { provide: CommunicationService, useValue: spyCommunicationService },
            ],
        });
        service = TestBed.inject(DifferencesDetectionHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('it should set the gameOver', () => {
        expect(service.isGameOver).toBeFalsy();
        service.setGameOver();
        expect(service.isGameOver).toBeTruthy();
    });

    it('should set number of differences found', () => {
        service.setNumberDifferencesFound(1, 3);
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

    // INTERFACE NEEDS TO CHANGE FIRST
    // it('should verify with server if coord is not valid', () => {
    //     const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
    //     const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    //     spyCommunicationService.validateCoordinates.and.callFake(() => {
    //         return of({ body: { differencesLeft: [], difference: [], isGameOver: false } } as HttpResponse<any>);
    //     });
    //     spyTimer.setNbOfDifferencesFound.and.callFake(() => {});

    //     // const spyDifferenceNotDetected = spyOn(service, 'differenceNotDetected');
    //     service.getDifferenceValidation('1', { x: 0, y: 1 }, ctx);

    //     spyOn(service, 'setNumberDifferencesFound').and.callFake(() => {});
    //     // spyOn(service, 'setNumberDifferencesFound').and.callFake(() => {});

    //     expect(spyCommunicationService.validateCoordinates).toHaveBeenCalled();
    //     // expect(spyDifferenceNotDetected).toHaveBeenCalled();
    // });
});
