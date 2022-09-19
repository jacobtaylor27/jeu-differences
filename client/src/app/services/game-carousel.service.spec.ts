import { TestBed } from '@angular/core/testing';

import { GameCarouselService } from './game-carousel.service';

describe('GameCarouselService', () => {
  let service: GameCarouselService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameCarouselService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
