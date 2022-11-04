/* eslint-disable @typescript-eslint/no-empty-function */
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

    it('getCards should return an array of game cards by calling getGameCards', () => {});

    it('should call setCards from game card handler service', () => {});

    it('getCarouselLength should call getNumberOfCards and return a number', () => {});

    it('resetRange should call resetRange method', () => {});

    it('setCardMode should call getGameCards make their isAdmin value to true', () => {});

    it('hasCards should call hasCards from game card handler service', () => {});

    it('hasPreviousCards should call getActiveCardsRange', () => {});

    it('hasNextCards should call getActiveCardsRange', () => {});

    it('showPreviousFour set the range to previous four values', () => {});

    it('showNextFour set the range to next four values', () => {});

    it('should return if there are more than 1 game card', () => {});

    it('should get the number of cards', () => {});
});
