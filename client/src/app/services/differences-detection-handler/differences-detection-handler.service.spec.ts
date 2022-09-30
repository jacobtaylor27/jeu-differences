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
});
