import { TestBed } from '@angular/core/testing';

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
        // Needs help
        const spy = spyOn(service, 'playWrongSound');

        service.playWrongSound();
        expect(spy).toHaveBeenCalled();
    });

    it('should create play wrong sound when difference not detected', () => {
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
});
