import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SIZE } from '@app/constants/canvas';
import { DifferencesDetectionHandlerService } from './differences-detection-handler.service';

describe('DifferencesDetectionHandlerService', () => {
    let service: DifferencesDetectionHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
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
        // NEED HELP : j'arrive pas a call fillRect
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
});
