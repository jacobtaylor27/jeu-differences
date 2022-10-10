import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SIZE } from '@app/constants/canvas';

import { DifferencesDetectionHandlerService } from './differences-detection-handler.service';

fdescribe('DifferencesDetectionHandlerService', () => {
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
        // Needs help
        let spy = spyOn(service, 'playWrongSound');

        service.playWrongSound();
        expect(spy).toHaveBeenCalled();

        spy = spyOn(service, 'playCorrectSound');

        service.playCorrectSound();
        expect(spy).toHaveBeenCalled();
    });

    it('should play wrong sound when difference not detected', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const spy = spyOn(service, 'playWrongSound');
        service.differenceNotDetected({ x: 0, y: 0 }, ctx);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should disabled mouse for one second when difference not detected', fakeAsync(() => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const mousePosition = { x: 0, y: 0 };
        expect(service.mouseIsDisabled).toBeFalsy();
        service.differenceNotDetected(mousePosition, ctx);
        expect(service.mouseIsDisabled).toBeTruthy();
        tick(1000);
        expect(service.mouseIsDisabled).toBeFalsy();
    }));

    it('should play correct sound when difference not detected', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const spy = spyOn(service, 'playCorrectSound');
        service.differenceDetected(ctx, ctx, []);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call display and clear ctx', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const spyDisplay = spyOn<DifferencesDetectionHandlerService, any>(service, 'displayDifferenceTemp');
        const spyClear = spyOn<DifferencesDetectionHandlerService, any>(service, 'clearDifference');

        service.differenceDetected(ctx, ctx, []);

        expect(spyDisplay).toHaveBeenCalled();
        expect(spyClear).toHaveBeenCalled();
    });
    it('should clear on canvas', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const clearRectSpy = spyOn(ctx, 'clearRect');
        service['clearDifference'](ctx, [{ x: 1, y: 3 }]);
        expect(clearRectSpy).toHaveBeenCalled();
    });
});
