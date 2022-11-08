import { TestBed } from '@angular/core/testing';

import { CanvasEventHandlerService } from './canvas-event-handler.service';

describe('CanvasEventHandlerService', () => {
    let service: CanvasEventHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CanvasEventHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
