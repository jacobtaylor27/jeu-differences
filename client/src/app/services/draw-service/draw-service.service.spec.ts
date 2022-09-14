import { TestBed } from '@angular/core/testing';

import { DrawServiceService } from './draw-service.service';

describe('DrawServiceService', () => {
  let service: DrawServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
