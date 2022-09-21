import { TestBed } from '@angular/core/testing';

import { GameCardHandlerService } from './game-card-handler.service';

describe('GameCardHandlerService', () => {
  let service: GameCardHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameCardHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
