import { TestBed } from '@angular/core/testing';

import { GameConstantServiceService } from './game-constant-service.service';

describe('GameConstantServiceService', () => {
  let service: GameConstantServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameConstantServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
