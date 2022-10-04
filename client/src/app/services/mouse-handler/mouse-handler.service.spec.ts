import { TestBed } from '@angular/core/testing';

import { MouseHandlerService } from './mouse-handler.service';

describe('MouseHandlerService', () => {
    let service: MouseHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MouseHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return MousePosition', () => {
        const mouseEvent = {
            clientX: 10,
            clientY: 10,
        } as MouseEvent;
        /* eslint-disable @typescript-eslint/no-magic-numbers */
        expect(service.mouseHitDetect(mouseEvent).x).toEqual(10);
        expect(service.mouseHitDetect(mouseEvent).y).toEqual(10);
    });
});
