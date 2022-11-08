import { TestBed } from '@angular/core/testing';

import { CanvasStateService } from './canvas-state.service';

describe('CanvasStateService', () => {
    let service: CanvasStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CanvasStateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
