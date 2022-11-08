import { TestBed } from '@angular/core/testing';

import { CommandHeapService } from './command-heap.service';

describe('CommandHeapService', () => {
    let service: CommandHeapService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CommandHeapService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
