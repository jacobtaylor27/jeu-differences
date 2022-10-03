import { TestBed } from '@angular/core/testing';

import { GameInfosService } from './game-infos.service';

describe('GameInfosService', () => {
  let service: GameInfosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameInfosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
