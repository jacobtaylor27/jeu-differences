import { TestBed } from '@angular/core/testing';

import { CommunicationSocketService } from './communication-socket.service';

describe('CommunicationSocketService', () => {
  let service: CommunicationSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunicationSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
